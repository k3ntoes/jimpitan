"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { WeeklyTransactionDetail } from "@/lib/definitions";
import { formatCurrency } from "@/lib/utils";

interface TransactionDetailModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transactions: WeeklyTransactionDetail[];
	weekLabel: string;
	type: "CREDIT" | "DEBIT";
}

export function TransactionDetailModal({
	open,
	onOpenChange,
	transactions,
	weekLabel,
	type,
}: TransactionDetailModalProps) {
	const filteredTransactions = transactions.filter((tx) => tx.type === type);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{type === "CREDIT" ? (
							<Badge variant="outline" className="border-emerald-600/40 bg-emerald-600/10 text-emerald-600">
								<ArrowUpRight className="w-3 h-3 mr-1" />
								Kredit (Masuk)
							</Badge>
						) : (
							<Badge variant="outline" className="border-red-600/40 bg-red-600/10 text-red-600">
								<ArrowDownRight className="w-3 h-3 mr-1" />
								Debit (Keluar)
							</Badge>
						)}
						- {weekLabel}
					</DialogTitle>
					<DialogDescription>
						Detail transaksi {type === "CREDIT" ? "masuk (kredit)" : "keluar (debit)"} pada {weekLabel.toLowerCase()}
					</DialogDescription>
				</DialogHeader>

				{filteredTransactions.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground text-sm">
						Tidak ada transaksi {type === "CREDIT" ? "kredit" : "debit"} pada minggu ini
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Tanggal</TableHead>
								<TableHead>Hari</TableHead>
								<TableHead className="text-right">Jumlah</TableHead>
								<TableHead>Keterangan</TableHead>
								<TableHead className="text-center">Hadir</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredTransactions.map((tx) => (
								<TableRow key={tx.id}>
									<TableCell className="font-medium">
										{format(new Date(tx.date), "d MMM yyyy", { locale: localeId })}
									</TableCell>
									<TableCell className="text-muted-foreground text-sm">{tx.day}</TableCell>
									<TableCell
										className={`text-right font-semibold ${type === "CREDIT" ? "text-emerald-600" : "text-red-600"}`}
									>
										{type === "CREDIT" ? "+" : "-"}
										{formatCurrency(tx.amount)}
									</TableCell>
									<TableCell className="text-sm">{tx.description || "—"}</TableCell>
									<TableCell className="text-center">
										{tx.attended ? (
											<span className="text-emerald-600 text-lg">✓</span>
										) : (
											<span className="text-red-600 text-lg">✗</span>
										)}
									</TableCell>
								</TableRow>
							))}
							<TableRow className="bg-muted/50 font-semibold">
								<TableCell colSpan={2}>Total</TableCell>
								<TableCell className={`text-right ${type === "CREDIT" ? "text-emerald-600" : "text-red-600"}`}>
									{formatCurrency(filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0))}
								</TableCell>
								<TableCell colSpan={2} />
							</TableRow>
						</TableBody>
					</Table>
				)}
			</DialogContent>
		</Dialog>
	);
}
