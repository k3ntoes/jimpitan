"use client";

import {
	ArrowDownRight,
	ArrowUpRight,
	PiggyBank,
	TrendingDown,
	TrendingUp,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { generateYears, getCurrentPeriod, MONTHS } from "@/lib/constants";
import { exportLaporanToExcel, exportLaporanToPDF } from "@/lib/export";
import { useLaporan } from "@/lib/queries";
import type { LaporanData, Week } from "@/lib/definitions";

export interface SummaryCard {
	title: string;
	value: number;
	icon: typeof Wallet;
	color: string;
	bg: string;
	border: string;
}

export interface ChartDataPoint {
	name: string;
	Pemasukan: number;
	Pengeluaran: number;
}

export interface UseLaporanDataReturn {
	year: string;
	setYear: (year: string) => void;
	month: string;
	setMonth: (month: string) => void;
	data: LaporanData | undefined;
	isLoading: boolean;
	totalCredit: number;
	totalDebit: number;
	selisih: number;
	chartData: ChartDataPoint[];
	summaryCards: SummaryCard[];
	selectedMonthLabel: string;
	hasData: boolean;
	handleExportExcel: () => void;
	handleExportPDF: () => void;
	years: number[];
}

export function useLaporanData(): UseLaporanDataReturn {
	const { year: currentYear, month: currentMonth } = getCurrentPeriod();

	const [year, setYear] = useState(currentYear.toString());
	const [month, setMonth] = useState(currentMonth.toString());

	const { data, isLoading } = useLaporan(year, month);

	const years = generateYears(5);

	const totalCredit = data?.weeks?.reduce((sum, w) => sum + w.totalCredit, 0) ?? 0;
	const totalDebit = data?.weeks?.reduce((sum, w) => sum + w.totalDebit, 0) ?? 0;
	const selisih = (data?.closingBalance ?? 0) - (data?.openingBalance ?? 0);

	const chartData: ChartDataPoint[] = data?.weeks?.map((w) => ({
		name: `Minggu ${w.weekNumber}`,
		Pemasukan: w.totalCredit,
		Pengeluaran: w.totalDebit,
	})) ?? [];

	const selectedMonthLabel = MONTHS.find((m) => m.value === month)?.label ?? "";

	const hasData = !!(data?.weeks && data.weeks.length > 0);

	const summaryCards: SummaryCard[] = [
		{
			title: "Saldo Awal",
			value: data?.openingBalance ?? 0,
			icon: Wallet,
			color: "text-blue-500",
			bg: "bg-blue-500/10",
			border: "border-blue-500/20",
		},
		{
			title: "Total Pemasukan",
			value: totalCredit,
			icon: ArrowUpRight,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/20",
		},
		{
			title: "Total Pengeluaran",
			value: totalDebit,
			icon: ArrowDownRight,
			color: "text-red-500",
			bg: "bg-red-500/10",
			border: "border-red-500/20",
		},
		{
			title: "Saldo Akhir",
			value: data?.closingBalance ?? 0,
			icon: PiggyBank,
			color: "text-purple-500",
			bg: "bg-purple-500/10",
			border: "border-purple-500/20",
		},
		{
			title: "Selisih",
			value: selisih,
			icon: selisih >= 0 ? TrendingUp : TrendingDown,
			color: selisih >= 0 ? "text-emerald-500" : "text-red-500",
			bg: selisih >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
			border: selisih >= 0 ? "border-emerald-500/20" : "border-red-500/20",
		},
	];

	const handleExportExcel = () => {
		if (!data) return;
		exportLaporanToExcel(data, month, year);
	};

	const handleExportPDF = () => {
		if (!data) return;
		exportLaporanToPDF(data, month, year);
	};

	return {
		year,
		setYear,
		month,
		setMonth,
		data,
		isLoading,
		totalCredit,
		totalDebit,
		selisih,
		chartData,
		summaryCards,
		selectedMonthLabel,
		hasData,
		handleExportExcel,
		handleExportPDF,
		years,
	};
}
