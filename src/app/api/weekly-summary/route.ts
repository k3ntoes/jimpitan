import { eachWeekOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { type NextRequest, NextResponse } from "next/server";
import type { WeeklySummary, WeeklySummaryResponse } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const monthParam = searchParams.get("month");
		const yearParam = searchParams.get("year");

		const currentDate = new Date();
		const month = monthParam ? parseInt(monthParam, 10) : currentDate.getMonth() + 1;
		const year = yearParam ? parseInt(yearParam, 10) : currentDate.getFullYear();

		// Validate month and year
		if (month < 1 || month > 12) {
			return NextResponse.json({ error: "Invalid month" }, { status: 400 });
		}

		const monthStart = startOfMonth(new Date(year, month - 1, 1));
		const monthEnd = endOfMonth(monthStart);

		// Get all weeks in the month
		const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 0, locale: localeId });

		// Calculate opening balance (all transactions before this month)
		const transactionsBeforeMonth = await prisma.transaction.findMany({
			where: { date: { lt: monthStart } },
			orderBy: { date: "asc" },
			select: { type: true, amount: true },
		});

		let openingBalance = 0;
		for (const tx of transactionsBeforeMonth) {
			if (tx.type === "CREDIT") openingBalance += tx.amount;
			else openingBalance -= tx.amount;
		}

		// Get all transactions in this month
		const monthTransactions = await prisma.transaction.findMany({
			where: {
				date: { gte: monthStart, lte: monthEnd },
			},
			orderBy: { date: "asc" },
			select: {
				id: true,
				date: true,
				day: true,
				type: true,
				amount: true,
				description: true,
				attended: true,
			},
		});

		// Process each week
		const weeklySummaries: WeeklySummary[] = [];
		let runningBalance = openingBalance;

		for (let i = 0; i < weeks.length; i++) {
			const weekStart = startOfWeek(weeks[i], { weekStartsOn: 0 });
			const weekEnd = endOfWeek(weeks[i], { weekStartsOn: 0 });

			// Filter transactions for this week
			const weekTransactions = monthTransactions.filter((tx) => {
				const txDate = new Date(tx.date);
				return txDate >= weekStart && txDate <= weekEnd;
			});

			// Calculate totals
			let totalCredit = 0;
			let totalDebit = 0;
			let creditCount = 0;
			let debitCount = 0;

			for (const tx of weekTransactions) {
				if (tx.type === "CREDIT") {
					totalCredit += tx.amount;
					creditCount++;
				} else {
					totalDebit += tx.amount;
					debitCount++;
				}
			}

			const weekOpeningBalance = runningBalance;
			const weekClosingBalance = weekOpeningBalance + totalCredit - totalDebit;
			runningBalance = weekClosingBalance;

			weeklySummaries.push({
				weekNumber: i + 1,
				weekLabel: `Minggu ${i + 1}`,
				startDate: format(weekStart, "yyyy-MM-dd"),
				endDate: format(weekEnd, "yyyy-MM-dd"),
				openingBalance: weekOpeningBalance,
				totalCredit,
				totalDebit,
				closingBalance: weekClosingBalance,
				creditCount,
				debitCount,
				transactions: weekTransactions.map((tx) => ({
					id: tx.id,
					date: format(new Date(tx.date), "yyyy-MM-dd"),
					day: tx.day,
					type: tx.type as "CREDIT" | "DEBIT",
					amount: tx.amount,
					description: tx.description,
					attended: tx.attended,
				})),
			});
		}

		const response: WeeklySummaryResponse = {
			month,
			year,
			monthLabel: format(monthStart, "MMMM yyyy", { locale: localeId }),
			weeks: weeklySummaries,
			openingBalance,
			closingBalance: runningBalance,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error fetching weekly summary:", error);
		return NextResponse.json({ error: "Failed to fetch weekly summary" }, { status: 500 });
	}
}
