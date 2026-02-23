"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicMonthlyStat } from "@/lib/public-summary";
import { formatCurrency } from "@/lib/utils";

export function MonthlyChart({ monthly }: { monthly: PublicMonthlyStat[] }) {
	// Ensure we have data
	const data = monthly || [];

	return (
		<Card className="col-span-4 lg:col-span-8 shadow-sm">
			<CardHeader>
				<CardTitle className="text-lg font-semibold text-slate-900">Trend Kas Bulanan</CardTitle>
				<CardDescription>Perbandingan pemasukan dan pengeluaran 6 bulan terakhir</CardDescription>
			</CardHeader>
			<CardContent className="px-2">
				<ResponsiveContainer width="100%" height={350}>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
						<XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
						<YAxis
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value: number) => `Rp${(value / 1000).toFixed(0)}k`}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "#fff",
								borderRadius: "8px",
								border: "1px solid #e2e8f0",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
							}}
							formatter={(value?: number) => formatCurrency(Number(value || 0))}
						/>
						<Legend verticalAlign="top" height={36} />
						<Bar dataKey="credit" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
						<Bar dataKey="debit" name="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

export function MonthlyChartSkeleton() {
	return (
		<Card className="col-span-4 lg:col-span-8 h-112.5">
			<CardHeader>
				<div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
				<div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
			</CardHeader>
			<CardContent>
				<div className="w-full h-75 bg-slate-50/50 rounded-lg animate-pulse flex items-end justify-between px-8 pb-4 gap-4">
					{Array.from({ length: 6 }, (_, i) => `skel-month-${i}`).map((key) => (
						<div key={key} className="w-full space-x-2 flex items-end h-full">
							<div className="w-1/2 bg-slate-200 rounded-t h-[40%]" style={{ height: `${Math.random() * 60 + 20}%` }} />
							<div className="w-1/2 bg-slate-200 rounded-t h-[30%]" style={{ height: `${Math.random() * 40 + 10}%` }} />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
