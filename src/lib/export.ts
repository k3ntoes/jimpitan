import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { LaporanData, Transaction } from "./definitions";
import { formatCurrency } from "./utils";

// Export Transactions to Excel
export function exportTransactionsToExcel(
	transactions: Transaction[],
	currentBalance: number,
	filters: {
		type?: string;
		month?: string;
		year?: string;
	},
) {
	// Calculate totals
	const totalCredit = transactions.filter((t) => t.type === "CREDIT").reduce((sum, t) => sum + t.amount, 0);
	const totalDebit = transactions.filter((t) => t.type === "DEBIT").reduce((sum, t) => sum + t.amount, 0);

	// Prepare data for Excel
	const data = transactions.map((t, index) => ({
		No: index + 1,
		Tanggal: format(new Date(t.date), "dd MMMM yyyy", { locale: localeId }),
		Hari: t.day,
		Tipe: t.type === "CREDIT" ? "MASUK" : "KELUAR",
		Jumlah: t.amount,
		Status: t.type === "CREDIT" ? (t.attended ? "Hadir" : "Tidak Hadir") : "-",
		Keterangan: t.description || "-",
	}));

	// Create summary section
	const summary = [
		[],
		["RINGKASAN"],
		["Saldo Saat Ini", currentBalance],
		["Total Kredit", totalCredit],
		["Total Debit", totalDebit],
		["Total Transaksi", transactions.length],
	];

	// Create filter info
	const filterInfo = [
		["LAPORAN TRANSAKSI JIMPITAN"],
		[],
		["Filter:"],
		["Tipe", filters.type === "ALL" || !filters.type ? "Semua" : filters.type === "CREDIT" ? "Kredit" : "Debit"],
		[
			"Periode",
			filters.month && filters.year
				? `${getMonthName(filters.month)} ${filters.year}`
				: filters.year
					? `Tahun ${filters.year}`
					: "Semua",
		],
		[],
	];

	// Create workbook
	const wb = XLSX.utils.book_new();
	const ws = XLSX.utils.aoa_to_sheet(filterInfo);

	// Add data table
	XLSX.utils.sheet_add_json(ws, data, { origin: -1, skipHeader: false });

	// Add summary
	XLSX.utils.sheet_add_aoa(ws, summary, { origin: -1 });

	// Auto-size columns
	const maxWidth = 50;
	const cols = [
		{ wch: 5 }, // No
		{ wch: 20 }, // Tanggal
		{ wch: 10 }, // Hari
		{ wch: 10 }, // Tipe
		{ wch: 15 }, // Jumlah
		{ wch: 15 }, // Status
		{ wch: 30 }, // Keterangan
	];
	ws["!cols"] = cols;

	XLSX.utils.book_append_sheet(wb, ws, "Transaksi");

	// Generate filename
	const filename = `Transaksi_${filters.month ? getMonthName(filters.month) : "Semua"}_${filters.year || "Semua"}_${format(new Date(), "yyyyMMdd")}.xlsx`;

	// Download
	XLSX.writeFile(wb, filename);
}

// Export Transactions to PDF
export function exportTransactionsToPDF(
	transactions: Transaction[],
	currentBalance: number,
	filters: {
		type?: string;
		month?: string;
		year?: string;
	},
) {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	// Title
	doc.setFontSize(16);
	doc.setFont("helvetica", "bold");
	doc.text("LAPORAN TRANSAKSI JIMPITAN", pageWidth / 2, 15, { align: "center" });

	// Filter info
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	let yPos = 25;
	doc.text(
		`Filter Tipe: ${filters.type === "ALL" || !filters.type ? "Semua" : filters.type === "CREDIT" ? "Kredit" : "Debit"}`,
		14,
		yPos,
	);
	yPos += 5;
	doc.text(
		`Periode: ${filters.month && filters.year ? `${getMonthName(filters.month)} ${filters.year}` : filters.year ? `Tahun ${filters.year}` : "Semua"}`,
		14,
		yPos,
	);
	yPos += 5;
	doc.text(`Tanggal Cetak: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: localeId })}`, 14, yPos);
	yPos += 10;

	// Calculate totals
	const totalCredit = transactions.filter((t) => t.type === "CREDIT").reduce((sum, t) => sum + t.amount, 0);
	const totalDebit = transactions.filter((t) => t.type === "DEBIT").reduce((sum, t) => sum + t.amount, 0);

	// Summary table
	autoTable(doc, {
		startY: yPos,
		head: [["RINGKASAN"]],
		body: [
			["Saldo Saat Ini", formatCurrency(currentBalance)],
			["Total Kredit", formatCurrency(totalCredit)],
			["Total Debit", formatCurrency(totalDebit)],
			["Total Transaksi", transactions.length.toString()],
		],
		theme: "grid",
		headStyles: { fillColor: [59, 130, 246], halign: "center" },
		columnStyles: {
			0: { fontStyle: "bold", cellWidth: 50 },
			1: { halign: "right", cellWidth: 50 },
		},
		margin: { left: 14, right: 14 },
	});

	// Transaction table
	const tableData = transactions.map((t, index) => [
		(index + 1).toString(),
		format(new Date(t.date), "dd/MM/yyyy", { locale: localeId }),
		t.day,
		t.type === "CREDIT" ? "MASUK" : "KELUAR",
		formatCurrency(t.amount),
		t.type === "CREDIT" ? (t.attended ? "Hadir" : "Tidak Hadir") : "-",
		t.description || "-",
	]);

	autoTable(doc, {
		startY: (doc as any).lastAutoTable.finalY + 10,
		head: [["No", "Tanggal", "Hari", "Tipe", "Jumlah", "Status", "Keterangan"]],
		body: tableData,
		theme: "striped",
		headStyles: { fillColor: [59, 130, 246] },
		columnStyles: {
			0: { cellWidth: 10, halign: "center" },
			1: { cellWidth: 25 },
			2: { cellWidth: 20 },
			3: { cellWidth: 20, halign: "center" },
			4: { cellWidth: 30, halign: "right" },
			5: { cellWidth: 25, halign: "center" },
			6: { cellWidth: "auto" },
		},
		styles: { fontSize: 8 },
		margin: { left: 14, right: 14 },
	});

	// Generate filename
	const filename = `Transaksi_${filters.month ? getMonthName(filters.month) : "Semua"}_${filters.year || "Semua"}_${format(new Date(), "yyyyMMdd")}.pdf`;

	// Download
	doc.save(filename);
}

// Export Laporan to Excel
export function exportLaporanToExcel(data: LaporanData, month: string, year: string) {
	const wb = XLSX.utils.book_new();

	// Create header section
	const header = [
		["LAPORAN MINGGUAN JIMPITAN"],
		[],
		["Periode", `${getMonthName(month)} ${year}`],
		["Saldo Awal", data.openingBalance],
		["Saldo Akhir", data.closingBalance],
		["Selisih", data.closingBalance - data.openingBalance],
		[],
	];

	const ws = XLSX.utils.aoa_to_sheet(header);

	// Add data for each week
	let currentRow = header.length;

	for (const week of data.weeks) {
		// Week header
		const weekHeader = [
			[],
			[`MINGGU ${week.weekNumber}`],
			["Saldo Awal Minggu", week.openingBalance],
			["Saldo Akhir Minggu", week.closingBalance],
			[],
			["No", "Tanggal", "Hari", "Tipe", "Jumlah", "Status", "Keterangan"],
		];

		XLSX.utils.sheet_add_aoa(ws, weekHeader, { origin: `A${currentRow + 1}` });
		currentRow += weekHeader.length;

		// Week transactions
		const weekData = week.transactions.map((t, index) => ({
			No: index + 1,
			Tanggal: format(new Date(t.date), "dd MMMM yyyy", { locale: localeId }),
			Hari: t.day,
			Tipe: t.type === "CREDIT" ? "MASUK" : "KELUAR",
			Jumlah: t.amount,
			Status: t.type === "CREDIT" ? (t.attended ? "Hadir" : "Tidak Hadir") : "-",
			Keterangan: t.description || "-",
		}));

		XLSX.utils.sheet_add_json(ws, weekData, {
			origin: `A${currentRow + 1}`,
			skipHeader: true,
		});
		currentRow += weekData.length;

		// Week summary
		const weekSummary = [[], ["Total Kredit", week.totalCredit], ["Total Debit", week.totalDebit], []];

		XLSX.utils.sheet_add_aoa(ws, weekSummary, { origin: `A${currentRow + 1}` });
		currentRow += weekSummary.length;
	}

	// Auto-size columns
	const cols = [
		{ wch: 5 }, // No
		{ wch: 20 }, // Tanggal
		{ wch: 10 }, // Hari
		{ wch: 10 }, // Tipe
		{ wch: 15 }, // Jumlah
		{ wch: 15 }, // Status
		{ wch: 30 }, // Keterangan
	];
	ws["!cols"] = cols;

	XLSX.utils.book_append_sheet(wb, ws, "Laporan Mingguan");

	// Generate filename
	const filename = `Laporan_${getMonthName(month)}_${year}_${format(new Date(), "yyyyMMdd")}.xlsx`;

	// Download
	XLSX.writeFile(wb, filename);
}

// Export Laporan to PDF
export function exportLaporanToPDF(data: LaporanData, month: string, year: string) {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	// Title
	doc.setFontSize(16);
	doc.setFont("helvetica", "bold");
	doc.text("LAPORAN MINGGUAN JIMPITAN", pageWidth / 2, 15, { align: "center" });

	// Period info
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	let yPos = 25;
	doc.text(`Periode: ${getMonthName(month)} ${year}`, 14, yPos);
	yPos += 5;
	doc.text(`Tanggal Cetak: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: localeId })}`, 14, yPos);
	yPos += 10;

	// Summary table
	autoTable(doc, {
		startY: yPos,
		head: [["RINGKASAN PERIODE"]],
		body: [
			["Saldo Awal", formatCurrency(data.openingBalance)],
			["Saldo Akhir", formatCurrency(data.closingBalance)],
			["Selisih", formatCurrency(data.closingBalance - data.openingBalance)],
		],
		theme: "grid",
		headStyles: { fillColor: [59, 130, 246], halign: "center" },
		columnStyles: {
			0: { fontStyle: "bold", cellWidth: 50 },
			1: { halign: "right", cellWidth: 50 },
		},
		margin: { left: 14, right: 14 },
	});

	// Add each week's data
	for (const week of data.weeks) {
		// Check if we need a new page
		if ((doc as any).lastAutoTable.finalY > 250) {
			doc.addPage();
			yPos = 15;
		} else {
			yPos = (doc as any).lastAutoTable.finalY + 10;
		}

		// Week title
		doc.setFontSize(12);
		doc.setFont("helvetica", "bold");
		doc.text(`Minggu ${week.weekNumber}`, 14, yPos);
		yPos += 5;

		// Week balance info
		doc.setFontSize(9);
		doc.setFont("helvetica", "normal");
		doc.text(
			`Saldo Awal: ${formatCurrency(week.openingBalance)} | Saldo Akhir: ${formatCurrency(week.closingBalance)}`,
			14,
			yPos,
		);
		yPos += 5;

		// Week transaction table
		const weekTableData = week.transactions.map((t, index) => [
			(index + 1).toString(),
			format(new Date(t.date), "dd/MM/yyyy", { locale: localeId }),
			t.day,
			t.type === "CREDIT" ? "MASUK" : "KELUAR",
			formatCurrency(t.amount),
			t.type === "CREDIT" ? (t.attended ? "Hadir" : "Tidak Hadir") : "-",
			t.description || "-",
		]);

		autoTable(doc, {
			startY: yPos,
			head: [["No", "Tanggal", "Hari", "Tipe", "Jumlah", "Status", "Keterangan"]],
			body: weekTableData,
			theme: "striped",
			headStyles: { fillColor: [59, 130, 246], fontSize: 8 },
			columnStyles: {
				0: { cellWidth: 10, halign: "center" },
				1: { cellWidth: 22 },
				2: { cellWidth: 18 },
				3: { cellWidth: 18, halign: "center" },
				4: { cellWidth: 28, halign: "right" },
				5: { cellWidth: 22, halign: "center" },
				6: { cellWidth: "auto" },
			},
			styles: { fontSize: 7 },
			margin: { left: 14, right: 14 },
		});

		// Week totals
		yPos = (doc as any).lastAutoTable.finalY + 3;
		doc.setFontSize(8);
		doc.setFont("helvetica", "bold");
		doc.text(
			`Total Kredit: ${formatCurrency(week.totalCredit)} | Total Debit: ${formatCurrency(week.totalDebit)}`,
			14,
			yPos,
		);
	}

	// Generate filename
	const filename = `Laporan_${getMonthName(month)}_${year}_${format(new Date(), "yyyyMMdd")}.pdf`;

	// Download
	doc.save(filename);
}

// Helper function to get month name
function getMonthName(month: string): string {
	const months = [
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember",
	];
	return months[parseInt(month, 10) - 1] || month;
}
