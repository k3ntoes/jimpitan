import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { LayoutDashboard, LogIn, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getPublicSummary } from "@/lib/public-summary";
import { getSession } from "@/lib/session";
import { FinancialSkeleton, FinancialSummary } from "./(landing)/components/v2/financial-summary";
import { MonthlyChart, MonthlyChartSkeleton } from "./(landing)/components/v2/monthly-chart";
import { RecentTransactions, TransactionSkeleton } from "./(landing)/components/v2/recent-transactions";
import { WeeklySummaryTable, WeeklySummaryTableSkeleton } from "./(landing)/components/v2/weekly-summary-table";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const revalidate = 900; // 15 minutes cache

export const metadata: Metadata = {
	title: "Transparansi Keuangan",
	description:
		"Laporan kas terbuka & real-time untuk kenyamanan bersama. Pantau pemasukan, pengeluaran, dan saldo kas jimpitan ronda warga secara transparan.",
	openGraph: {
		title: "Transparansi Keuangan - Jimpitan Ronda",
		description: "Laporan kas terbuka & real-time untuk kenyamanan bersama",
		type: "website",
	},
};

export default async function Home() {
	const summaryPromise = getPublicSummary();
	const sessionPromise = getSession();

	const [summary, session] = await Promise.all([summaryPromise, sessionPromise]);
	const isLoggedIn = !!session?.userId;

	return (
		<div className={`${display.className} min-h-screen bg-slate-50/50 flex flex-col`}>
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
					<Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
							<ShieldCheck className="h-5 w-5" />
						</div>
						<span className="text-lg font-bold tracking-tight text-slate-900">Jimpitan Warga</span>
					</Link>
					<div className="flex gap-2">
						{isLoggedIn ? (
							<Button asChild size="sm" className="gap-2 shadow-sm font-medium">
								<Link href="/dashboard">
									<LayoutDashboard className="h-4 w-4" />
									Dashboard
								</Link>
							</Button>
						) : (
							<Button asChild variant="outline" size="sm" className="gap-2 shadow-sm font-medium">
								<Link href="/login">
									<LogIn className="h-4 w-4" />
									Masuk
								</Link>
							</Button>
						)}
					</div>
				</div>
			</header>

			<main className="flex-1 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
				{/* Page Hero */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Transparansi Keuangan</h1>
						<p className="text-sm text-muted-foreground">Laporan kas terbuka & real-time untuk kenyamanan bersama.</p>
					</div>
					<div className="flex flex-col sm:items-end gap-1">
						<div className="text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 w-fit">
							Periode: {summary.metrics.period}
						</div>
						<p className="text-[10px] text-muted-foreground/80">
							Terakhir diupdate:{" "}
							{summary.metrics.lastDate ? format(summary.metrics.lastDate, "dd MMM HH:mm", { locale: localeId }) : "-"}
						</p>
					</div>
				</div>

				{/* Key Metrics */}
				<Suspense fallback={<FinancialSkeleton />}>
					<FinancialSummary metrics={summary.metrics} />
				</Suspense>

				{/* Charts & Lists - Improved Grid Layout */}
				<div className="grid gap-6 lg:grid-cols-12 lg:gap-8 items-start">
					{/* Main Chart Area */}
					<div className="lg:col-span-8 flex flex-col gap-6 w-full">
						<Suspense fallback={<MonthlyChartSkeleton />}>
							<MonthlyChart monthly={summary.monthly} />
						</Suspense>
					</div>

					{/* Sidebar / List Area */}
					<div className="lg:col-span-4 flex flex-col gap-6 w-full h-full">
						<Suspense fallback={<TransactionSkeleton />}>
							<RecentTransactions transactions={summary.recent} />
						</Suspense>
					</div>
				</div>

				{/* Weekly Summary Table */}
				<Suspense fallback={<WeeklySummaryTableSkeleton />}>
					<WeeklySummaryTable />
				</Suspense>
			</main>

			<footer className="mt-auto border-t bg-white py-8">
				<div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
					<p>© {new Date().getFullYear()} Paguyuban Warga RT 05. All rights reserved.</p>
					<div className="flex gap-4">
						<span className="cursor-not-allowed opacity-50">Privasi</span>
						<span className="cursor-not-allowed opacity-50">Ketentuan</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
