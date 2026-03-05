"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
	Activity,
	ArrowDownRight,
	ArrowLeftRight,
	ArrowUpRight,
	BarChart3,
	CalendarDays,
	FileText,
	PieChart as PieChartIcon,
	TrendingDown,
	TrendingUp,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Pie,
	PieChart,
	type PieSectorShapeProps,
	ResponsiveContainer,
	Sector,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSummary } from "@/lib/queries";
import { formatCompactRupiah, formatCurrency } from "@/lib/utils";

export default function DashboardClient() {
	const { data, isLoading } = useSummary();

	// Calculate trends
	const monthlyStats = data?.monthlyStats ?? [];
	const currentMonth = monthlyStats[monthlyStats.length - 1];
	const previousMonth = monthlyStats[monthlyStats.length - 2];

	const creditTrend =
		currentMonth && previousMonth
			? ((currentMonth.credit - previousMonth.credit) / (previousMonth.credit || 1)) * 100
			: 0;

	const debitTrend =
		currentMonth && previousMonth ? ((currentMonth.debit - previousMonth.debit) / (previousMonth.debit || 1)) * 100 : 0;

	// Prepare balance trend data
	const balanceTrend = monthlyStats.map((stat: { label: string; credit: number; debit: number }, index: number) => {
		const prevBalance =
			index === 0
				? 0
				: monthlyStats
						.slice(0, index)
						.reduce((acc: number, s: { credit: number; debit: number }) => acc + s.credit - s.debit, 0);
		const balance = prevBalance + stat.credit - stat.debit;
		return {
			...stat,
			balance,
		};
	});

	// Type distribution for pie chart
	const typeDistribution = [
		{ name: "Pemasukan", value: data?.totalCredit ?? 0, color: "#10b981" },
		{ name: "Pengeluaran", value: data?.totalDebit ?? 0, color: "#ef4444" },
	];

	// Custom shape for Pie chart (replaces deprecated Cell)
	const CustomPieSector = (props: PieSectorShapeProps) => {
		const color = typeDistribution[props.index]?.color ?? "#64748b";
		return <Sector {...props} fill={color} />;
	};

	const stats = [
		{
			title: "Saldo Saat Ini",
			value: data?.balance ?? 0,
			icon: Wallet,
			color: "text-blue-400",
			bg: "bg-blue-500/10",
			border: "border-blue-500/20",
			trend: null,
			description: "Total saldo tersedia",
		},
		{
			title: "Pemasukan Bulan Ini",
			value: currentMonth?.credit ?? 0,
			icon: ArrowUpRight,
			color: "text-emerald-400",
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/20",
			trend: creditTrend,
			description: "Total pemasukan bulan ini",
		},
		{
			title: "Pengeluaran Bulan Ini",
			value: currentMonth?.debit ?? 0,
			icon: ArrowDownRight,
			color: "text-red-400",
			bg: "bg-red-500/10",
			border: "border-red-500/20",
			trend: debitTrend,
			description: "Total pengeluaran bulan ini",
		},
		{
			title: "Total Transaksi",
			value: data?.transactionCount ?? 0,
			icon: Activity,
			color: "text-purple-400",
			bg: "bg-purple-500/10",
			border: "border-purple-500/20",
			isCount: true,
			trend: null,
			description: "Semua transaksi tercatat",
		},
	];

	return (
		<div className="space-y-6 pb-8">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
				<div>
					<h2 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard Admin</h2>
					<p className="text-gray-600 text-sm mt-1">
						Selamat datang kembali! Berikut ringkasan aktivitas keuangan Jimpitan Ronda.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-sm text-gray-700 flex items-center gap-2 shadow-sm">
						<CalendarDays className="w-4 h-4 text-blue-600" />
						{format(new Date(), "EEEE, d MMMM yyyy", { locale: localeId })}
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat, _i) => {
					const Icon = stat.icon;
					const hasTrend = stat.trend !== null && stat.trend !== undefined;
					const isPositiveTrend = stat.trend && stat.trend > 0;

					return (
						<Card
							key={stat.title}
							className={`bg-white border ${stat.border} shadow-md relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
						>
							<div
								className={`absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none`}
							>
								<Icon className={`w-32 h-32 ${stat.color}`} />
							</div>

							<CardContent className="p-6 relative z-10">
								<div className="flex items-center justify-between mb-4">
									<div className={`p-3 rounded-xl ${stat.bg} backdrop-blur-sm ring-1 ring-gray-200`}>
										<Icon className={`w-6 h-6 ${stat.color}`} />
									</div>
									{hasTrend && !isLoading && (
										<div
											className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
												isPositiveTrend
													? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
													: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
											}`}
										>
											{isPositiveTrend ? (
												<TrendingUp className="w-3.5 h-3.5" />
											) : (
												<TrendingDown className="w-3.5 h-3.5" />
											)}
											{Math.abs(stat.trend || 0).toFixed(1)}%
										</div>
									)}
								</div>

								<div className="space-y-1">
									<p className="text-gray-600 text-sm font-medium tracking-wide uppercase text-[10px]">{stat.title}</p>
									{isLoading ? (
										<Skeleton className="h-8 w-32 bg-gray-200 rounded-md" />
									) : (
										<p className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">
											{stat.isCount ? stat.value.toLocaleString("id-ID") : formatCurrency(stat.value)}
										</p>
									)}
									<p className="text-xs text-gray-500 font-medium">{stat.description}</p>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Chart Area */}
				<div className="lg:col-span-2 space-y-6">
					{/* Balance Trend */}
					<Card className="bg-white border-gray-200 shadow-md overflow-hidden">
						<CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-200 bg-gray-50/50">
							<div>
								<CardTitle className="text-gray-900 text-lg font-bold flex items-center gap-2">
									<Activity className="w-5 h-5 text-blue-600" />
									Tren Keuangan
								</CardTitle>
								<CardDescription className="text-gray-600 text-xs mt-1">
									Analisis pemasukan, pengeluaran, dan saldo 6 bulan terakhir
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="pt-6 px-3 sm:px-6">
							{isLoading ? (
								<div className="h-75 flex items-center justify-center text-gray-500">
									<div className="flex flex-col items-center gap-2">
										<Activity className="w-8 h-8 animate-pulse text-gray-400" />
										<span className="text-sm">Memuat data grafik...</span>
									</div>
								</div>
							) : (
								<div className="h-75 w-full">
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart data={balanceTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
											<defs>
												<linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
													<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
												</linearGradient>
												<linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
													<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
											<XAxis
												dataKey="label"
												stroke="#9ca3af"
												tick={{ fontSize: 12 }}
												tickLine={false}
												axisLine={false}
												dy={10}
											/>
											<YAxis
												stroke="#9ca3af"
												tick={{ fontSize: 11 }}
												tickFormatter={(v) => formatCompactRupiah(v)}
												tickLine={false}
												axisLine={false}
												dx={-10}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "#ffffff",
													border: "1px solid #e5e7eb",
													borderRadius: "12px",
													boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
													color: "#111827",
												}}
												itemStyle={{ fontSize: "12px" }}
												labelStyle={{
													fontWeight: "bold",
													color: "#6b7280",
													marginBottom: "8px",
												}}
												formatter={(value, name) => [
													formatCurrency(Number(value) ?? 0),
													name === "balance" ? "Saldo Akhir" : name === "credit" ? "Pemasukan" : "Pengeluaran",
												]}
											/>
											<Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
											<Area
												type="monotone"
												dataKey="balance"
												name="Saldo Akhir"
												stroke="#3b82f6"
												strokeWidth={3}
												fillOpacity={1}
												fill="url(#colorBalance)"
												activeDot={{ r: 6, strokeWidth: 0, stroke: "#60a5fa" }}
											/>
											<Area
												type="monotone"
												dataKey="credit"
												name="Pemasukan"
												stroke="#10b981"
												strokeWidth={2}
												strokeDasharray="5 5"
												fillOpacity={1}
												fill="url(#colorCredit)"
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Side Stats */}
				<div className="space-y-6">
					{/* Actions Card */}
					<Card className="bg-linear-to-br from-indigo-50 to-blue-50 border-indigo-200 shadow-md h-auto">
						<CardContent className="p-6">
							<h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
								<Activity className="w-5 h-5 text-indigo-600" />
								Aksi Cepat
							</h3>
							<div className="grid grid-cols-2 gap-3 mb-4">
								<Button
									variant="default"
									className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-auto py-3 px-4 shadow-lg shadow-emerald-900/20"
									asChild
								>
									<Link href="/transaksi?action=new&type=CREDIT">
										<div className="flex flex-col items-start gap-1">
											<div className="p-1 bg-white/20 rounded-lg mb-1">
												<ArrowUpRight className="w-4 h-4 text-white" />
											</div>
											<span className="text-xs font-semibold">Uang Masuk</span>
										</div>
									</Link>
								</Button>
								<Button
									variant="default"
									className="w-full justify-start bg-red-600 hover:bg-red-700 text-white border-0 h-auto py-3 px-4 shadow-lg shadow-red-900/20"
									asChild
								>
									<Link href="/transaksi?action=new&type=DEBIT">
										<div className="flex flex-col items-start gap-1">
											<div className="p-1 bg-white/20 rounded-lg mb-1">
												<ArrowDownRight className="w-4 h-4 text-white" />
											</div>
											<span className="text-xs font-semibold">Uang Keluar</span>
										</div>
									</Link>
								</Button>
							</div>
							<div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
								<Button
									variant="secondary"
									size="sm"
									className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
									asChild
								>
									<Link href="/laporan">
										<FileText className="w-3.5 h-3.5 mr-2 text-blue-600" />
										Laporan
									</Link>
								</Button>
								<Button
									variant="secondary"
									size="sm"
									className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
									asChild
								>
									<Link href="/transaksi">
										<ArrowLeftRight className="w-3.5 h-3.5 mr-2 text-purple-600" />
										Semua Data
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Distribution Pie Chart */}
					<Card className="bg-white border-gray-200 shadow-md flex flex-col overflow-hidden">
						<CardHeader className="pb-2 border-b border-gray-200 bg-gray-50/50">
							<CardTitle className="text-gray-900 text-base flex items-center gap-2">
								<PieChartIcon className="w-4 h-4 text-purple-600" />
								Distribusi Dana
							</CardTitle>
						</CardHeader>
						<CardContent className="flex-1 flex flex-col justify-center pt-6">
							{isLoading ? (
								<div className="h-40 flex items-center justify-center text-gray-500">Memuat...</div>
							) : (
								<div className="relative">
									<div className="h-45 w-full">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={typeDistribution}
													cx="50%"
													cy="50%"
													innerRadius={60}
													outerRadius={80}
													paddingAngle={5}
													dataKey="value"
													stroke="none"
													shape={CustomPieSector}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#ffffff",
														border: "1px solid #e5e7eb",
														borderRadius: "8px",
														color: "#111827",
													}}
													formatter={(value) => [formatCurrency(Number(value) || 0), ""]}
												/>
											</PieChart>
										</ResponsiveContainer>
									</div>
									<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
										<div className="text-center">
											<p className="text-xs text-gray-600 mb-1">Total Mutasi</p>
											<p className="text-sm font-bold text-gray-900">
												{formatCompactRupiah((data?.totalCredit ?? 0) + (data?.totalDebit ?? 0))}
											</p>
										</div>
									</div>
								</div>
							)}
							<div className="grid grid-cols-2 gap-3 mt-4">
								{typeDistribution.map((item) => (
									<div
										key={item.name}
										className="flex flex-col gap-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200"
									>
										<div className="flex items-center gap-2">
											<div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
											<span className="text-[10px] uppercase font-bold text-gray-600 leading-none">{item.name}</span>
										</div>
										<span className="text-sm font-bold text-gray-900 truncate pl-4">
											{formatCompactRupiah(item.value)}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Recent Transactions & Monthly Bar */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Transactions List */}
				<Card className="lg:col-span-1 bg-white border-gray-200 shadow-md flex flex-col h-full overflow-hidden">
					<CardHeader className="pb-3 border-b border-gray-200 bg-gray-50/50">
						<div className="flex items-center justify-between">
							<CardTitle className="text-gray-900 text-base font-bold">Transaksi Terkini</CardTitle>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
								asChild
							>
								<Link href="/transaksi">Lihat Semua</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent className="pt-0 flex-1 p-0">
						<div className="divide-y divide-gray-200">
							{isLoading ? (
								[1, 2, 3, 4, 5].map((i) => (
									<div key={i} className="flex items-center gap-3 p-4">
										<Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
										<div className="space-y-1 flex-1">
											<Skeleton className="h-4 w-24 bg-gray-200" />
											<Skeleton className="h-3 w-16 bg-gray-200" />
										</div>
									</div>
								))
							) : data?.recent?.length === 0 ? (
								<div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
									<Activity className="w-10 h-10 mb-3 opacity-30" />
									<p className="text-sm">Belum ada transaksi</p>
								</div>
							) : (
								data?.recent?.map(
									(t: { id: string; type: string; amount: number; date: string; description?: string }) => (
										<div
											key={t.id}
											className="group flex items-center justify-between gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
										>
											<div className="flex items-center gap-3 min-w-0">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
														t.type === "CREDIT"
															? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20"
															: "bg-red-500/10 border-red-500/20 text-red-400 group-hover:bg-red-500/20"
													} transition-colors`}
												>
													{t.type === "CREDIT" ? (
														<ArrowUpRight className="w-5 h-5" />
													) : (
														<ArrowDownRight className="w-5 h-5" />
													)}
												</div>
												<div className="min-w-0">
													<p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
														{t.description || "Transaksi Tanpa Keterangan"}
													</p>
													<p className="text-xs text-gray-600 flex items-center gap-1">
														<CalendarDays className="w-3 h-3" />
														{format(new Date(t.date), "d MMM, HH:mm", {
															locale: localeId,
														})}
													</p>
												</div>
											</div>
											<div className="text-right shrink-0">
												<p className={`text-sm font-bold ${t.type === "CREDIT" ? "text-emerald-400" : "text-red-400"}`}>
													{t.type === "CREDIT" ? "+" : "-"}
													{formatCompactRupiah(t.amount)}
												</p>
											</div>
										</div>
									),
								)
							)}
						</div>
					</CardContent>
				</Card>

				{/* Detailed Monthly Stats */}
				<Card className="lg:col-span-2 bg-white border-gray-200 shadow-md overflow-hidden">
					<CardHeader className="pb-3 border-b border-gray-200 bg-gray-50/50">
						<CardTitle className="text-gray-900 flex items-center gap-2 text-base font-bold">
							<BarChart3 className="w-4 h-4 text-indigo-600" />
							Statistik Bulanan Detail
						</CardTitle>
						<CardDescription className="text-gray-600 text-xs">
							Perbandingan pendapatan dan pengeluaran per bulan
						</CardDescription>
					</CardHeader>
					<CardContent className="pt-6 px-4">
						{isLoading ? (
							<div className="h-62.5 flex items-center justify-center text-gray-500">Memuat grafik...</div>
						) : (
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={monthlyStats} barGap={4}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
									<XAxis
										dataKey="label"
										stroke="#9ca3af"
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
										dy={10}
									/>
									<YAxis
										stroke="#9ca3af"
										tick={{ fontSize: 11 }}
										tickFormatter={(v) => formatCompactRupiah(v)}
										tickLine={false}
										axisLine={false}
										dx={-10}
									/>
									<Tooltip
										cursor={{ fill: "#f3f4f6", opacity: 0.4 }}
										contentStyle={{
											backgroundColor: "#ffffff",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
											color: "#111827",
										}}
										formatter={(value) => [formatCurrency(Number(value) || 0), ""]}
									/>
									<Legend wrapperStyle={{ fontSize: 12, paddingTop: "20px" }} iconType="circle" />
									<Bar dataKey="credit" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
									<Bar dataKey="debit" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
								</BarChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
