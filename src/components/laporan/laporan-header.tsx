import {
	BookOpen,
	CalendarDays,
	FileSpreadsheet,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS } from "@/lib/constants";

interface LaporanHeaderProps {
	selectedMonthLabel: string;
	year: string;
	month: string;
	setMonth: (month: string) => void;
	setYear: (year: string) => void;
	years: number[];
	hasData: boolean;
	onExportExcel: () => void;
	onExportPDF: () => void;
}

export function LaporanHeader({
	selectedMonthLabel,
	year,
	month,
	setMonth,
	setYear,
	years,
	hasData,
	onExportExcel,
	onExportPDF,
}: LaporanHeaderProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
			<div>
				<h2 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
					<BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
					Laporan Mingguan
				</h2>
				<p className="text-gray-600 text-sm mt-1">Laporan transaksi per minggu dengan kalkulasi saldo</p>
			</div>
			<div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
				<div className="col-span-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-sm text-gray-700 flex items-center gap-2 shadow-sm">
					<CalendarDays className="w-4 h-4 text-blue-600" />
					{selectedMonthLabel} {year}
				</div>
				<Select value={month} onValueChange={setMonth}>
					<SelectTrigger className="w-full sm:w-38 bg-white shadow-sm">
						<SelectValue placeholder="Bulan" />
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
					<SelectTrigger className="w-full sm:w-28 bg-white shadow-sm">
						<SelectValue placeholder="Tahun" />
					</SelectTrigger>
					<SelectContent>
						{years.map((y) => (
							<SelectItem key={y} value={y.toString()}>
								{y}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button
					onClick={onExportExcel}
					disabled={!hasData}
					variant="outline"
					size="sm"
					className="border-green-600 text-green-600 hover:bg-green-50 bg-white shadow-sm"
				>
					<FileSpreadsheet className="w-4 h-4 mr-2" />
					Excel
				</Button>
				<Button
					onClick={onExportPDF}
					disabled={!hasData}
					variant="outline"
					size="sm"
					className="border-red-600 text-red-600 hover:bg-red-50 bg-white shadow-sm"
				>
					<FileText className="w-4 h-4 mr-2" />
					PDF
				</Button>
			</div>
		</div>
	);
}
