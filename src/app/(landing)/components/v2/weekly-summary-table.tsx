"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateYears, getCurrentPeriod, MONTHS } from "@/lib/constants";
import type { WeeklySummary, WeeklySummaryResponse } from "@/lib/definitions";
import { formatCurrency } from "@/lib/utils";
import { TransactionDetailModal } from "./transaction-detail-modal";

export function WeeklySummaryTable() {
	const currentPeriod = getCurrentPeriod();
	const [month, setMonth] = useState<string>(currentPeriod.month.toString());
	const [year, setYear] = useState<string>(currentPeriod.year.toString());
	const [data, setData] = useState<WeeklySummaryResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedWeek, setSelectedWeek] = useState<WeeklySummary | null>(null);
	const [selectedType, setSelectedType] = useState<"CREDIT" | "DEBIT">("CREDIT");

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(`/api/weekly-summary?month=${month}&year=${year}`);
				if (response.ok) {
					const result = await response.json();
					setData(result);
				}
			} catch (error) {
				console.error("Error fetching weekly summary:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [month, year]);

	const handleInfoClick = (week: WeeklySummary, type: "CREDIT" | "DEBIT") => {
		setSelectedWeek(week);
		setSelectedType(type);
		setModalOpen(true);
	};

	return (
		<Card className="border-slate-200 shadow-sm">
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle>Ringkasan Transaksi Mingguan</CardTitle>
						<CardDescription>Laporan transaksi per minggu dengan detail saldo</CardDescription>
					</div>
					<div className="flex gap-2">
						<Select value={month} onValueChange={setMonth}>
							<SelectTrigger className="w-36">
								<SelectValue placeholder="Pilih Bulan" />
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
							<SelectTrigger className="w-28">
								<SelectValue placeholder="Pilih Tahun" />
							</SelectTrigger>
							<SelectContent>
								{generateYears(5).map((y) => (
									<SelectItem key={y} value={y.toString()}>
										{y}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-3">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-16 w-full" />
					</div>
				) : data && data.weeks.length > 0 ? (
					<>
						<div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
							<Badge variant="outline" className="font-normal">
								Periode: {data.monthLabel}
							</Badge>
							<span>•</span>
							<span>
								Saldo Awal: <strong className="text-foreground">{formatCurrency(data.openingBalance)}</strong>
							</span>
							<span>•</span>
							<span>
								Saldo Akhir: <strong className="text-foreground">{formatCurrency(data.closingBalance)}</strong>
							</span>
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent">
										<TableHead className="font-semibold">Minggu</TableHead>
										<TableHead className="font-semibold">Periode</TableHead>
										<TableHead className="text-right font-semibold">Saldo Awal</TableHead>
										<TableHead className="text-right font-semibold">Kredit</TableHead>
										<TableHead className="text-right font-semibold">Debit</TableHead>
										<TableHead className="text-right font-semibold">Saldo Akhir</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.weeks.map((week) => (
										<TableRow key={week.weekNumber}>
											<TableCell className="font-medium">{week.weekLabel}</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{format(new Date(week.startDate), "d MMM", { locale: localeId })} -{" "}
												{format(new Date(week.endDate), "d MMM", { locale: localeId })}
											</TableCell>
											<TableCell className="text-right font-medium">{formatCurrency(week.openingBalance)}</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													<span className="font-semibold text-emerald-600">{formatCurrency(week.totalCredit)}</span>
													{week.creditCount > 0 && (
														<Button
															size="icon"
															variant="ghost"
															className="h-6 w-6 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
															onClick={() => handleInfoClick(week, "CREDIT")}
														>
															<Info className="h-3.5 w-3.5" />
														</Button>
													)}
												</div>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1">
													<span className="font-semibold text-red-600">{formatCurrency(week.totalDebit)}</span>
													{week.debitCount > 0 && (
														<Button
															size="icon"
															variant="ghost"
															className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
															onClick={() => handleInfoClick(week, "DEBIT")}
														>
															<Info className="h-3.5 w-3.5" />
														</Button>
													)}
												</div>
											</TableCell>
											<TableCell className="text-right font-semibold">{formatCurrency(week.closingBalance)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</>
				) : (
					<div className="text-center py-12 text-muted-foreground">
						Tidak ada data transaksi untuk periode yang dipilih
					</div>
				)}
			</CardContent>

			{selectedWeek && (
				<TransactionDetailModal
					open={modalOpen}
					onOpenChange={setModalOpen}
					transactions={selectedWeek.transactions}
					weekLabel={selectedWeek.weekLabel}
					type={selectedType}
				/>
			)}
		</Card>
	);
}

export function WeeklySummaryTableSkeleton() {
	return (
		<Card className="border-slate-200 shadow-sm">
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="space-y-2">
						<Skeleton className="h-6 w-64" />
						<Skeleton className="h-4 w-48" />
					</div>
					<div className="flex gap-2">
						<Skeleton className="h-10 w-36" />
						<Skeleton className="h-10 w-28" />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
				</div>
			</CardContent>
		</Card>
	);
}
