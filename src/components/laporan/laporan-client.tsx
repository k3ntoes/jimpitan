"use client";

import { useLaporanData } from "@/hooks/use-laporan-data";
import { LaporanChart } from "./laporan-chart";
import { LaporanEmpty } from "./laporan-empty";
import { LaporanHeader } from "./laporan-header";
import { LaporanSkeleton } from "./laporan-skeleton";
import { LaporanSummaryCards } from "./laporan-summary-cards";
import { LaporanWeekTable } from "./laporan-week-table";

export default function LaporanClient() {
	const laporan = useLaporanData();

	return (
		<div className="space-y-6 pb-8">
			<LaporanHeader
				selectedMonthLabel={laporan.selectedMonthLabel}
				year={laporan.year}
				month={laporan.month}
				setMonth={laporan.setMonth}
				setYear={laporan.setYear}
				years={laporan.years}
				hasData={laporan.hasData}
				onExportExcel={laporan.handleExportExcel}
				onExportPDF={laporan.handleExportPDF}
			/>

			{laporan.isLoading ? (
				<LaporanSkeleton />
			) : !laporan.hasData ? (
				<LaporanEmpty monthLabel={laporan.selectedMonthLabel} year={laporan.year} />
			) : (
				<>
					<LaporanSummaryCards cards={laporan.summaryCards} />
					<LaporanChart
						chartData={laporan.chartData}
						weeks={laporan.data!.weeks}
						totalCredit={laporan.totalCredit}
						totalDebit={laporan.totalDebit}
					/>
					{laporan.data!.weeks.map((week) => (
						<LaporanWeekTable key={week.weekKey} week={week} />
					))}
				</>
			)}
		</div>
	);
}
