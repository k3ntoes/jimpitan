import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
	ArrowDownRight,
	ArrowUpRight,
	Banknote,
	CheckCircle2,
	Wallet,
	XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { Week } from "@/lib/definitions";

interface LaporanWeekTableProps {
	week: Week;
}

export function LaporanWeekTable({ week }: LaporanWeekTableProps) {
	const weekTotalCredit = week.totalCredit;
	const weekTotalDebit = week.totalDebit;

	return (
		<Card className="bg-white border-gray-200 shadow-md overflow-hidden">
			<CardHeader className="bg-gray-50/50 border-b border-gray-200">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
					<CardTitle className="text-gray-900 text-lg font-bold">Minggu {week.weekNumber}</CardTitle>
					<div className="flex items-center gap-2 flex-wrap">
						<Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50">
							<ArrowUpRight className="w-3 h-3 mr-1" />
							{formatCurrency(weekTotalCredit)}
						</Badge>
						<Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">
							<ArrowDownRight className="w-3 h-3 mr-1" />
							{formatCurrency(weekTotalDebit)}
						</Badge>
						<Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
							<Wallet className="w-3 h-3 mr-1" />
							{formatCurrency(week.closingBalance)}
						</Badge>
					</div>
				</div>
				<CardDescription className="text-gray-500 text-xs">
					Saldo Awal: <span className="font-semibold text-gray-700">{formatCurrency(week.openingBalance)}</span>
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-50/30">
							<TableHead className="font-semibold hidden sm:table-cell">Hari</TableHead>
							<TableHead className="font-semibold">Tanggal</TableHead>
							<TableHead className="font-semibold">Status</TableHead>
							<TableHead className="font-semibold">Tipe</TableHead>
							<TableHead className="text-right font-semibold">Jumlah</TableHead>
							<TableHead className="font-semibold">Keterangan</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{week.transactions.map((t) => (
							<TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
								<TableCell className="font-medium hidden sm:table-cell">{t.day}</TableCell>
								<TableCell className="text-gray-600">{format(new Date(t.date), "dd/MM/yyyy", { locale: localeId })}</TableCell>
								<TableCell>
									{t.type === "CREDIT" ? (
										t.attended ? (
											<span className="inline-flex items-center gap-1 text-emerald-600">
												<CheckCircle2 className="w-4 h-4" />
												<span className="text-xs font-medium">Hadir</span>
											</span>
										) : (
											<span className="inline-flex items-center gap-1 text-red-500">
												<XCircle className="w-4 h-4" />
												<span className="text-xs font-medium">Tidak</span>
											</span>
										)
									) : (
										<span className="text-gray-400">-</span>
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
						<TableRow className="bg-emerald-50/50 border-t-2 border-gray-200">
							<TableCell colSpan={4} className="font-bold text-emerald-700 hidden sm:table-cell">
								<span className="flex items-center gap-1.5">
									<ArrowUpRight className="w-4 h-4" />
									Total Pemasukan
								</span>
							</TableCell>
							<TableCell colSpan={3} className="font-bold text-emerald-700 sm:hidden">
								<span className="flex items-center gap-1.5">
									<ArrowUpRight className="w-4 h-4" />
									Total Pemasukan
								</span>
							</TableCell>
							<TableCell className="text-right font-bold text-emerald-700">
								{formatCurrency(weekTotalCredit)}
							</TableCell>
							<TableCell />
						</TableRow>
						<TableRow className="bg-red-50/50">
							<TableCell colSpan={4} className="font-bold text-red-700 hidden sm:table-cell">
								<span className="flex items-center gap-1.5">
									<ArrowDownRight className="w-4 h-4" />
									Total Pengeluaran
								</span>
							</TableCell>
							<TableCell colSpan={3} className="font-bold text-red-700 sm:hidden">
								<span className="flex items-center gap-1.5">
									<ArrowDownRight className="w-4 h-4" />
									Total Pengeluaran
								</span>
							</TableCell>
							<TableCell className="text-right font-bold text-red-700">
								{formatCurrency(weekTotalDebit)}
							</TableCell>
							<TableCell />
						</TableRow>
						<TableRow className="bg-blue-50/70 border-t-2 border-blue-200">
							<TableCell colSpan={4} className="text-lg font-bold text-blue-800 hidden sm:table-cell">
								<span className="flex items-center gap-1.5">
									<Banknote className="w-4 h-4" />
									SALDO
								</span>
							</TableCell>
							<TableCell colSpan={3} className="text-lg font-bold text-blue-800 sm:hidden">
								<span className="flex items-center gap-1.5">
									<Banknote className="w-4 h-4" />
									SALDO
								</span>
							</TableCell>
							<TableCell className="text-right text-lg font-bold text-blue-800">
								{formatCurrency(week.closingBalance)}
							</TableCell>
							<TableCell />
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
