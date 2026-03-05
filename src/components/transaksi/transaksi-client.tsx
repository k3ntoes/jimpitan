"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowDownRight, ArrowUpRight, FileSpreadsheet, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateYears, getCurrentPeriod, MONTHS } from "@/lib/constants";
import type { Transaction } from "@/lib/definitions";
import { exportTransactionsToExcel, exportTransactionsToPDF } from "@/lib/export";
import { useDeleteTransaction, useTransactions } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import TransactionDialog from "./transaction-dialog";

export default function TransaksiClient() {
	const currentPeriod = getCurrentPeriod();
	const [typeFilter, setTypeFilter] = useState("ALL");
	const [monthFilter, setMonthFilter] = useState<string>(currentPeriod.month.toString());
	const [yearFilter, setYearFilter] = useState<string>(currentPeriod.year.toString());
	const [page, setPage] = useState(1);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingTx, setEditingTx] = useState<Transaction | null>(null);

	const { data, isLoading } = useTransactions(
		typeFilter,
		page,
		15,
		monthFilter !== "ALL" ? monthFilter : undefined,
		yearFilter !== "ALL" ? yearFilter : undefined,
	);
	const deleteMutation = useDeleteTransaction();

	const handleDelete = (id: string) => {
		if (confirm("Yakin ingin menghapus transaksi ini?")) {
			deleteMutation.mutate(id);
		}
	};

	const handleExportExcel = () => {
		if (!data) return;
		exportTransactionsToExcel(transactions, data.currentBalance, {
			type: typeFilter,
			month: monthFilter,
			year: yearFilter,
		});
	};

	const handleExportPDF = () => {
		if (!data) return;
		exportTransactionsToPDF(transactions, data.currentBalance, {
			type: typeFilter,
			month: monthFilter,
			year: yearFilter,
		});
	};

	const transactions: Transaction[] = data?.transactions ?? [];
	const pagination = data?.pagination;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900">Transaksi</h2>
					<p className="text-gray-600 text-sm mt-1">Kelola data kredit dan debit iuran jimpitan</p>
				</div>
				<Button
					onClick={() => {
						setEditingTx(null);
						setDialogOpen(true);
					}}
					className="bg-blue-600 hover:bg-blue-500 text-white"
				>
					<Plus className="w-4 h-4 mr-2" />
					<span className="sm:hidden">Tambah</span>
					<span className="hidden sm:inline">Tambah Transaksi</span>
				</Button>
			</div>

			{/* Balance Highlight */}
			{data && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<Card className="bg-blue-50 border-blue-200">
						<CardContent className="p-4 text-center">
							<p className="text-gray-600 text-xs mb-1">Saldo</p>
							<p className="text-blue-600 font-bold text-base sm:text-lg">{formatCurrency(data.currentBalance)}</p>
						</CardContent>
					</Card>
					<Card className="bg-emerald-50 border-emerald-200">
						<CardContent className="p-4 text-center">
							<p className="text-gray-600 text-xs mb-1">Total Kredit</p>
							<p className="text-emerald-600 font-bold text-base sm:text-lg">
								{formatCurrency(transactions.filter((t) => t.type === "CREDIT").reduce((s, t) => s + t.amount, 0))}
							</p>
						</CardContent>
					</Card>
					<Card className="bg-red-50 border-red-200">
						<CardContent className="p-4 text-center">
							<p className="text-gray-600 text-xs mb-1">Total Debit</p>
							<p className="text-red-600 font-bold text-base sm:text-lg">
								{formatCurrency(transactions.filter((t) => t.type === "DEBIT").reduce((s, t) => s + t.amount, 0))}
							</p>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Filters */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
				<div className="grid grid-cols-3 sm:flex gap-3">
					<Select
						value={typeFilter}
						onValueChange={(v) => {
							setTypeFilter(v);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 text-gray-700">
							<SelectValue placeholder="Semua Tipe" />
						</SelectTrigger>
						<SelectContent className="bg-white border-gray-200">
							<SelectItem value="ALL">Semua Tipe</SelectItem>
							<SelectItem value="CREDIT">Kredit (Masuk)</SelectItem>
							<SelectItem value="DEBIT">Debit (Keluar)</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={monthFilter}
						onValueChange={(v) => {
							setMonthFilter(v);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 text-gray-700">
							<SelectValue placeholder="Semua Bulan" />
						</SelectTrigger>
						<SelectContent className="bg-white border-gray-200">
							<SelectItem value="ALL">Semua Bulan</SelectItem>
							{MONTHS.map((month) => (
								<SelectItem key={month.value} value={month.value}>
									{month.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={yearFilter}
						onValueChange={(v) => {
							setYearFilter(v);
							setPage(1);
						}}
					>
						<SelectTrigger className="w-full sm:w-32 bg-white border-gray-300 text-gray-700">
							<SelectValue placeholder="Semua Tahun" />
						</SelectTrigger>
						<SelectContent className="bg-white border-gray-200">
							<SelectItem value="ALL">Semua Tahun</SelectItem>
							{generateYears().map((year) => (
								<SelectItem key={year} value={year.toString()}>
									{year}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<p className="text-gray-600 text-sm hidden sm:block">{pagination ? `${pagination.total} transaksi` : ""}</p>
				<div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
					<Button
						onClick={handleExportExcel}
						disabled={!data || transactions.length === 0}
						variant="outline"
						size="sm"
						className="border-green-600 text-green-600 hover:bg-green-50 flex-1 sm:flex-none"
					>
						<FileSpreadsheet className="w-4 h-4 sm:mr-2" />
						<span className="hidden sm:inline">Export Excel</span>
					</Button>
					<Button
						onClick={handleExportPDF}
						disabled={!data || transactions.length === 0}
						variant="outline"
						size="sm"
						className="border-red-600 text-red-600 hover:bg-red-50 flex-1 sm:flex-none"
					>
						<FileText className="w-4 h-4 sm:mr-2" />
						<span className="hidden sm:inline">Export PDF</span>
					</Button>
				</div>
			</div>

			{/* Table */}
			<Card className="bg-white border-gray-200">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="border-gray-200 hover:bg-transparent">
								<TableHead className="text-gray-600">Tanggal</TableHead>
								<TableHead className="text-gray-600 hidden sm:table-cell">Hari</TableHead>
								<TableHead className="text-gray-600">Tipe</TableHead>
								<TableHead className="text-gray-600 text-right">Jumlah</TableHead>
								<TableHead className="text-gray-600">Keterangan</TableHead>
								<TableHead className="text-gray-600 text-center hidden sm:table-cell">Hadir</TableHead>
								<TableHead className="text-gray-600 text-right">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center text-gray-500 py-12">
										Memuat data...
									</TableCell>
								</TableRow>
							) : transactions.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center text-gray-500 py-12">
										Belum ada transaksi. Tambah transaksi baru!
									</TableCell>
								</TableRow>
							) : (
								transactions.map((t) => (
									<TableRow key={t.id} className="border-gray-200 hover:bg-gray-50">
										<TableCell className="text-gray-700 text-sm">
											{format(new Date(t.date), "d MMM yyyy", {
												locale: localeId,
											})}
										</TableCell>
										<TableCell className="text-gray-600 text-sm hidden sm:table-cell">{t.day}</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className={
													t.type === "CREDIT"
														? "border-emerald-600/40 bg-emerald-600/10 text-emerald-400 text-xs"
														: "border-red-600/40 bg-red-600/10 text-red-400 text-xs"
												}
											>
												{t.type === "CREDIT" ? (
													<ArrowUpRight className="w-3 h-3 mr-1" />
												) : (
													<ArrowDownRight className="w-3 h-3 mr-1" />
												)}
												{t.type === "CREDIT" ? "Kredit" : "Debit"}
											</Badge>
										</TableCell>
										<TableCell
											className={`text-right font-semibold text-sm ${
												t.type === "CREDIT" ? "text-emerald-400" : "text-red-400"
											}`}
										>
											{t.type === "CREDIT" ? "+" : "-"}
											{formatCurrency(t.amount)}
										</TableCell>
										<TableCell className="text-gray-600 text-sm max-w-50 truncate">{t.description || "—"}</TableCell>
										<TableCell className="text-center text-lg hidden sm:table-cell">
											{t.attended ? (
												<span className="text-emerald-400">✓</span>
											) : (
												<span className="text-red-400">✗</span>
											)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-1">
												<Button
													size="icon"
													variant="ghost"
													className="h-8 w-8 sm:h-7 sm:w-7 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
													onClick={() => {
														setEditingTx(t);
														setDialogOpen(true);
													}}
												>
													<Pencil className="w-3.5 h-3.5" />
												</Button>
												<Button
													size="icon"
													variant="ghost"
													className="h-8 w-8 sm:h-7 sm:w-7 text-gray-600 hover:text-red-600 hover:bg-red-50"
													onClick={() => handleDelete(t.id)}
													disabled={deleteMutation.isPending}
												>
													<Trash2 className="w-3.5 h-3.5" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="border-gray-300 text-gray-700"
						disabled={page === 1}
						onClick={() => setPage((p) => p - 1)}
					>
						Sebelumnya
					</Button>
					<span className="text-gray-600 text-sm">
						Hal {page} / {pagination.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						className="border-slate-700 text-slate-300"
						disabled={page === pagination.totalPages}
						onClick={() => setPage((p) => p + 1)}
					>
						Berikutnya
					</Button>
				</div>
			)}

			<TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editingTx} />
		</div>
	);
}
