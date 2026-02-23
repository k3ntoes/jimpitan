import { ArrowDownRight, ArrowUpRight, History, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicMetrics } from "@/lib/public-summary";
import { formatCurrency } from "@/lib/utils";

export function FinancialSummary({ metrics }: { metrics: PublicMetrics }) {
	// Safe default for balance
	const balance = metrics?.balance ?? 0;

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card className="bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border-indigo-100 dark:border-indigo-900/50">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium text-muted-foreground">Saldo Kas Saat Ini</CardTitle>
					<PiggyBank className="h-4 w-4 text-indigo-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{formatCurrency(balance)}</div>
					<p className="text-xs text-muted-foreground mt-1">Total akumulasi dana tersedia</p>
				</CardContent>
			</Card>

			<Card className="bg-linear-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background border-emerald-100 dark:border-emerald-900/50">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium text-muted-foreground">Pemasukan Bulan Ini</CardTitle>
					<TrendingUp className="h-4 w-4 text-emerald-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
						{formatCurrency(metrics?.totalCredit ?? 0)}
					</div>
					<div className="flex items-center text-xs text-emerald-600/80 mt-1">
						<ArrowUpRight className="mr-1 h-3 w-3" />
						{metrics?.creditCount ?? 0} transaksi masuk
					</div>
				</CardContent>
			</Card>

			<Card className="bg-linear-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-background border-rose-100 dark:border-rose-900/50">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium text-muted-foreground">Pengeluaran Bulan Ini</CardTitle>
					<TrendingDown className="h-4 w-4 text-rose-500" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-rose-700 dark:text-rose-400">
						{formatCurrency(metrics?.totalDebit ?? 0)}
					</div>
					<div className="flex items-center text-xs text-rose-600/80 mt-1">
						<ArrowDownRight className="mr-1 h-3 w-3" />
						{metrics?.debitCount ?? 0} transaksi keluar
					</div>
				</CardContent>
			</Card>

			<Card className="bg-linear-to-br from-slate-50 to-white dark:from-slate-900/20 dark:to-background border-slate-100 dark:border-slate-800">
				<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
					<CardTitle className="text-sm font-medium text-muted-foreground">Net Cash Flow</CardTitle>
					<History className="h-4 w-4 text-slate-500" />
				</CardHeader>
				<CardContent>
					<div
						className={`text-2xl font-bold ${(metrics?.currentNet ?? 0) >= 0 ? "text-slate-900 dark:text-slate-100" : "text-rose-600"}`}
					>
						{formatCurrency(metrics?.currentNet ?? 0)}
					</div>
					<p className="text-xs text-muted-foreground mt-1">Selisih masuk - keluar bulan {metrics?.period}</p>
				</CardContent>
			</Card>
		</div>
	);
}

export function FinancialSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }, (_, i) => `skel-fin-${i}`).map((key) => (
				<Card key={key} className="bg-muted/40 animate-pulse border-none">
					<CardHeader className="pb-2 space-y-0">
						<div className="h-4 w-24 bg-muted-foreground/20 rounded" />
					</CardHeader>
					<CardContent>
						<div className="h-8 w-32 bg-muted-foreground/20 rounded mb-2" />
						<div className="h-3 w-20 bg-muted-foreground/20 rounded" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
