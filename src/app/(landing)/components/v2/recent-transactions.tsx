import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicTransaction } from "@/lib/public-summary";
import { formatCurrency } from "@/lib/utils";

export function RecentTransactions({ transactions }: { transactions: PublicTransaction[] }) {
	if (!transactions || transactions.length === 0) {
		return (
			<Card className="col-span-4 lg:col-span-4 h-full">
				<CardHeader>
					<CardTitle>Transaksi Terakhir</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground p-8 text-center italic">Belum ada transaksi tercatat</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="col-span-4 lg:col-span-4 h-full flex flex-col">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-lg font-semibold text-slate-900">Aktivitas Terakhir</CardTitle>
				<Link
					href="/transaksi"
					className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
				>
					Lihat semua <ArrowUpRight className="h-3 w-3" />
				</Link>
			</CardHeader>
			<CardContent className="px-6 flex-1">
				<div className="space-y-6">
					{transactions.map((tx) => (
						<div key={tx.id} className="flex items-start justify-between group">
							<div className="flex gap-4 items-start">
								<div
									className={`mt-1 h-9 w-9 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white ${tx.type === "CREDIT" ? "bg-emerald-100/50" : "bg-rose-100/50"}`}
								>
									{tx.type === "CREDIT" ? (
										<ArrowUpRight className="h-4 w-4 text-emerald-600" />
									) : (
										<ArrowDownRight className="h-4 w-4 text-rose-600" />
									)}
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium leading-none text-slate-900 group-hover:text-indigo-700 transition-colors">
										{tx.description || (tx.type === "CREDIT" ? "Pemasukan" : "Pengeluaran")}
									</p>
									<p className="text-xs text-muted-foreground">
										{format(new Date(tx.date), "dd MMM yyyy • HH:mm", { locale: localeId })}
									</p>
								</div>
							</div>
							<div
								className={`text-sm font-bold tabular-nums ${tx.type === "CREDIT" ? "text-emerald-600" : "text-slate-900"}`}
							>
								{tx.type === "CREDIT" ? "+" : "-"}
								{formatCurrency(tx.amount)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export function TransactionSkeleton() {
	return (
		<Card className="col-span-4 lg:col-span-4 h-full">
			<CardHeader>
				<div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="h-9 w-9 bg-slate-100 rounded-full animate-pulse" />
								<div className="space-y-2">
									<div className="h-3 w-40 bg-slate-100 rounded animate-pulse" />
									<div className="h-2 w-24 bg-slate-50 rounded animate-pulse" />
								</div>
							</div>
							<div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
