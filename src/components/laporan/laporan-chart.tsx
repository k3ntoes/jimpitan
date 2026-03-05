import { BarChart3, CalendarDays } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactRupiah, formatCurrency } from "@/lib/utils";
import type { Week } from "@/lib/definitions";
import type { ChartDataPoint } from "@/hooks/use-laporan-data";

interface LaporanChartProps {
	chartData: ChartDataPoint[];
	weeks: Week[];
	totalCredit: number;
	totalDebit: number;
}

export function LaporanChart({ chartData, weeks, totalCredit, totalDebit }: LaporanChartProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Bar Chart */}
			<Card className="lg:col-span-2 bg-white border-gray-200 shadow-md overflow-hidden">
				<CardHeader className="pb-2 border-b border-gray-200 bg-gray-50/50">
					<CardTitle className="text-gray-900 text-lg font-bold flex items-center gap-2">
						<BarChart3 className="w-5 h-5 text-indigo-600" />
						Ringkasan Bulanan
					</CardTitle>
					<CardDescription className="text-gray-600 text-xs mt-1">
						Perbandingan pemasukan vs pengeluaran per minggu
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-6 px-2 sm:px-6">
					<div className="h-72 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData} barGap={4}>
								<defs>
									<linearGradient id="gradCredit" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#10b981" stopOpacity={1} />
										<stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
									</linearGradient>
									<linearGradient id="gradDebit" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
										<stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
								<XAxis
									dataKey="name"
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
										borderRadius: "12px",
										boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
										color: "#111827",
									}}
									itemStyle={{ fontSize: "12px" }}
									formatter={(value) => [formatCurrency(Number(value) || 0), ""]}
								/>
								<Legend wrapperStyle={{ fontSize: 12, paddingTop: "20px" }} iconType="circle" />
								<Bar dataKey="Pemasukan" fill="url(#gradCredit)" radius={[6, 6, 0, 0]} maxBarSize={60} />
								<Bar dataKey="Pengeluaran" fill="url(#gradDebit)" radius={[6, 6, 0, 0]} maxBarSize={60} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>

			{/* Weekly Progress Sidebar */}
			<Card className="bg-white border-gray-200 shadow-md overflow-hidden">
				<CardHeader className="pb-3 border-b border-gray-200 bg-gray-50/50">
					<CardTitle className="text-gray-900 text-base font-bold flex items-center gap-2">
						<CalendarDays className="w-4 h-4 text-blue-600" />
						Ringkasan Per Minggu
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="divide-y divide-gray-100">
						{weeks.map((week) => {
							const weekNet = week.totalCredit - week.totalDebit;
							const maxAmount = Math.max(totalCredit, totalDebit) || 1;
							const creditPercent = Math.round((week.totalCredit / maxAmount) * 100);
							const debitPercent = Math.round((week.totalDebit / maxAmount) * 100);
							return (
								<div key={week.weekKey} className="p-4 hover:bg-gray-50/50 transition-colors">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-semibold text-gray-900">Minggu {week.weekNumber}</span>
										<span className={`text-xs font-bold ${weekNet >= 0 ? "text-emerald-600" : "text-red-600"}`}>
											{weekNet >= 0 ? "+" : ""}{formatCompactRupiah(weekNet)}
										</span>
									</div>
									<div className="space-y-1.5">
										<div className="flex items-center gap-2">
											<span className="text-[10px] text-gray-500 w-12">Masuk</span>
											<div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
												<div
													className="h-full bg-emerald-500 rounded-full transition-all duration-500"
													style={{ width: `${creditPercent}%` }}
												/>
											</div>
											<span className="text-[10px] font-medium text-gray-600 w-16 text-right">{formatCompactRupiah(week.totalCredit)}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-[10px] text-gray-500 w-12">Keluar</span>
											<div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
												<div
													className="h-full bg-red-500 rounded-full transition-all duration-500"
													style={{ width: `${debitPercent}%` }}
												/>
											</div>
											<span className="text-[10px] font-medium text-gray-600 w-16 text-right">{formatCompactRupiah(week.totalDebit)}</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
