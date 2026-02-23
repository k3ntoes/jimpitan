"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateYears, getCurrentPeriod, MONTHS } from "@/lib/constants";
import { exportLaporanToExcel, exportLaporanToPDF } from "@/lib/export";
import { useLaporan } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

export default function LaporanClient() {
	const { year: currentYear, month: currentMonth } = getCurrentPeriod();

	const [year, setYear] = useState(currentYear.toString());
	const [month, setMonth] = useState(currentMonth.toString());

	const { data, isLoading } = useLaporan(year, month);

	const handleExportExcel = () => {
		if (!data) return;
		exportLaporanToExcel(data, month, year);
	};

	const handleExportPDF = () => {
		if (!data) return;
		exportLaporanToPDF(data, month, year);
	};

	const years = generateYears(5);
	const _months = [
		{ value: "1", label: "Januari" },
		{ value: "2", label: "Februari" },
		{ value: "3", label: "Maret" },
		{ value: "4", label: "April" },
		{ value: "5", label: "Mei" },
		{ value: "6", label: "Juni" },
		{ value: "7", label: "Juli" },
		{ value: "8", label: "Agustus" },
		{ value: "9", label: "September" },
		{ value: "10", label: "Oktober" },
		{ value: "11", label: "November" },
		{ value: "12", label: "Desember" },
	];

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Laporan Mingguan</h2>
				<p className="text-muted-foreground">Laporan transaksi per minggu dengan kalkulasi saldo</p>
			</div>

			<div className="flex gap-4">
				<Select value={month} onValueChange={setMonth}>
					<SelectTrigger className="w-45">
						<SelectValue placeholder="Pilih bulan" />
					</SelectTrigger>
					<SelectContent>
						{MONTHS.map((m) => (
							<SelectItem key={m.value} value={m.value}>
								{m.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={year} onValueChange={setYear}>
					<SelectTrigger className="w-45">
						<SelectValue placeholder="Pilih tahun" />
					</SelectTrigger>
					<SelectContent>
						{years.map((y) => (
							<SelectItem key={y} value={y.toString()}>
								{y}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<div className="ml-auto flex items-center gap-2">
					<Button
						onClick={handleExportExcel}
						disabled={!data || !data.weeks || data.weeks.length === 0}
						variant="outline"
						size="sm"
						className="border-green-600 text-green-600 hover:bg-green-50"
					>
						<FileSpreadsheet className="w-4 h-4 mr-2" />
						Export Excel
					</Button>
					<Button
						onClick={handleExportPDF}
						disabled={!data || !data.weeks || data.weeks.length === 0}
						variant="outline"
						size="sm"
						className="border-red-600 text-red-600 hover:bg-red-50"
					>
						<FileText className="w-4 h-4 mr-2" />
						Export PDF
					</Button>
				</div>
			</div>

			{isLoading ? (
				<Card>
					<CardContent className="pt-6">
						<Skeleton className="h-100 w-full" />
					</CardContent>
				</Card>
			) : !data?.weeks || data.weeks.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<p className="text-center text-muted-foreground">Tidak ada data untuk periode ini</p>
					</CardContent>
				</Card>
			) : (
				<>
					<div className="grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Saldo Awal</CardDescription>
								<CardTitle className="text-2xl">{formatCurrency(data.openingBalance)}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Saldo Akhir</CardDescription>
								<CardTitle className="text-2xl">{formatCurrency(data.closingBalance)}</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-3">
								<CardDescription>Selisih</CardDescription>
								<CardTitle className="text-2xl">{formatCurrency(data.closingBalance - data.openingBalance)}</CardTitle>
							</CardHeader>
						</Card>
					</div>

					{data.weeks.map((week) => (
						<Card key={week.weekKey}>
							<CardHeader>
								<CardTitle>Minggu {week.weekNumber}</CardTitle>
								<CardDescription>
									Saldo Awal: <span className="font-semibold">{formatCurrency(week.openingBalance)}</span>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Hari</TableHead>
											<TableHead>Tanggal</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Tipe</TableHead>
											<TableHead className="text-right">Jumlah</TableHead>
											<TableHead>Keterangan</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{week.transactions.map((t) => (
											<TableRow key={t.id}>
												<TableCell className="font-medium">{t.day}</TableCell>
												<TableCell>{format(new Date(t.date), "dd/MM/yyyy", { locale: localeId })}</TableCell>
												<TableCell>
													{t.type === "CREDIT" ? (
														t.attended ? (
															<span className="text-green-600">✓</span>
														) : (
															<span className="text-red-600">✗</span>
														)
													) : (
														"-"
													)}
												</TableCell>
												<TableCell>
													<Badge variant={t.type === "CREDIT" ? "default" : "destructive"}>
														{t.type === "CREDIT" ? "MASUK" : "KELUAR"}
													</Badge>
												</TableCell>
												<TableCell className="text-right font-medium">{formatCurrency(t.amount)}</TableCell>
												<TableCell className="text-muted-foreground">{t.description || "-"}</TableCell>
											</TableRow>
										))}
										<TableRow className="bg-muted/50">
											<TableCell colSpan={4} className="font-bold">
												Total Pemasukan
											</TableCell>
											<TableCell className="text-right font-bold text-green-600">
												{formatCurrency(week.totalCredit)}
											</TableCell>
											<TableCell />
										</TableRow>
										<TableRow className="bg-muted/50">
											<TableCell colSpan={4} className="font-bold">
												Total Pengeluaran
											</TableCell>
											<TableCell className="text-right font-bold text-red-600">
												{formatCurrency(week.totalDebit)}
											</TableCell>
											<TableCell />
										</TableRow>
										<TableRow className="bg-primary/10">
											<TableCell colSpan={4} className="text-lg font-bold">
												SALDO
											</TableCell>
											<TableCell className="text-right text-lg font-bold">
												{formatCurrency(week.closingBalance)}
											</TableCell>
											<TableCell />
										</TableRow>
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					))}
				</>
			)}
		</div>
	);
}
