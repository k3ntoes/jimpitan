import { format, startOfWeek } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { type NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

// Route segment config - this endpoint requires auth check so it's dynamic
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
	try {
		await verifySession();

		// All transactions ordered by date
		const transactions = await prisma.transaction.findMany({
			orderBy: { date: "asc" },
		});

		let totalCredit = 0;
		let totalDebit = 0;

		for (const t of transactions) {
			if (t.type === "CREDIT") totalCredit += t.amount;
			else totalDebit += t.amount;
		}

		const balance = totalCredit - totalDebit;

		// Weekly groups
		const weekMap = new Map<
			string,
			{
				weekKey: string;
				weekLabel: string;
				openingBalance: number;
				transactions: typeof transactions;
				totalCredit: number;
				totalDebit: number;
				closingBalance: number;
			}
		>();

		let runningBalance = 0;

		for (const t of transactions) {
			const date = new Date(t.date);
			const weekStart = startOfWeek(date, { weekStartsOn: 0 });
			const weekKey = format(weekStart, "yyyy-MM-dd");

			if (!weekMap.has(weekKey)) {
				weekMap.set(weekKey, {
					weekKey,
					weekLabel: `Minggu ${format(weekStart, "d MMM yyyy", { locale: localeId })}`,
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

		// Recent 5 transactions
		const recent = transactions.slice(-5).reverse();

		// Monthly stats (last 6 months)
		const now = new Date();
		const monthlyStats = [];
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
			const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
			const monthTransactions = transactions.filter(
				(t) => new Date(t.date) >= monthStart && new Date(t.date) <= monthEnd,
			);
			const credit = monthTransactions.filter((t) => t.type === "CREDIT").reduce((s, t) => s + t.amount, 0);
			const debit = monthTransactions.filter((t) => t.type === "DEBIT").reduce((s, t) => s + t.amount, 0);
			monthlyStats.push({
				label: format(d, "MMM", { locale: localeId }),
				credit,
				debit,
			});
		}

		return NextResponse.json({
			balance,
			totalCredit,
			totalDebit,
			transactionCount: transactions.length,
			weeks: weeks.map((w) => ({
				...w,
				transactions: undefined, // don't return full transactions here for perf
			})),
			recent,
			monthlyStats,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
