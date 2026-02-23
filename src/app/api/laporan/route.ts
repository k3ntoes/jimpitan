import { format, startOfWeek } from "date-fns";
import { type NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	try {
		await verifySession();
		const { searchParams } = new URL(req.url);
		const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString(), 10);
		const month = searchParams.get("month");

		const startDate = month ? new Date(year, parseInt(month, 10) - 1, 1) : new Date(year, 0, 1);
		const endDate = month ? new Date(year, parseInt(month, 10), 0, 23, 59, 59) : new Date(year, 11, 31, 23, 59, 59);

		const transactions = await prisma.transaction.findMany({
			where: { date: { gte: startDate, lte: endDate } },
			orderBy: { date: "asc" },
		});

		// Calculate opening balance (all transactions before this period)
		const prevTransactions = await prisma.transaction.findMany({
			where: { date: { lt: startDate } },
			select: { type: true, amount: true },
		});
		let openingBalance = 0;
		for (const t of prevTransactions) {
			openingBalance += t.type === "CREDIT" ? t.amount : -t.amount;
		}

		// Group by week
		const weekMap = new Map<
			string,
			{
				weekNumber: number;
				weekKey: string;
				openingBalance: number;
				transactions: typeof transactions;
				totalCredit: number;
				totalDebit: number;
				closingBalance: number;
			}
		>();

		let runningBalance = openingBalance;
		let weekCounter = 1;

		for (const t of transactions) {
			const date = new Date(t.date);
			const weekStart = startOfWeek(date, { weekStartsOn: 0 });
			const weekKey = format(weekStart, "yyyy-MM-dd");

			if (!weekMap.has(weekKey)) {
				weekMap.set(weekKey, {
					weekNumber: weekCounter++,
					weekKey,
					openingBalance: runningBalance,
					transactions: [],
					totalCredit: 0,
					totalDebit: 0,
					closingBalance: 0,
				});
			}

			const week = weekMap.get(weekKey);
			if (!week) continue;
			week.transactions.push(t);
			if (t.type === "CREDIT") {
				week.totalCredit += t.amount;
				runningBalance += t.amount;
			} else {
				week.totalDebit += t.amount;
				runningBalance -= t.amount;
			}
			week.closingBalance = runningBalance;
		}

		const weeks = Array.from(weekMap.values());

		return NextResponse.json({
			weeks,
			openingBalance,
			closingBalance: runningBalance,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
