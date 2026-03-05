import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { prisma } from "./prisma";

export type PublicMonthlyStat = {
	label: string;
	month: number;
	year: number;
	credit: number;
	debit: number;
	net: number;
};

export type PublicTransaction = {
	id: string;
	date: Date;
	type: string;
	amount: number;
	description: string | null;
	attended: boolean;
};

export type PublicMetrics = {
	balance: number;
	totalCredit: number;
	totalDebit: number;
	creditCount: number;
	debitCount: number;
	transactionCount: number;
	period: string;
	currentNet: number;
	trendPercent: number | null;
	lastDate: Date | null;
};

export type PublicSummary = {
	metrics: PublicMetrics;
	monthly: PublicMonthlyStat[];
	recent: PublicTransaction[];
};

export async function getPublicSummary(): Promise<PublicSummary> {
	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

	const [
		transactionCount,
		creditAgg,
		debitAgg,
		creditCount,
		debitCount,
		firstTx,
		lastTx,
		currentCreditAgg,
		currentDebitAgg,
		prevCreditAgg,
		prevDebitAgg,
		recent,
	] = await Promise.all([
		prisma.transaction.count(),
		prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "CREDIT" } }),
		prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "DEBIT" } }),
		prisma.transaction.count({ where: { type: "CREDIT" } }),
		prisma.transaction.count({ where: { type: "DEBIT" } }),
		prisma.transaction.findFirst({ orderBy: { date: "asc" }, select: { date: true } }),
		prisma.transaction.findFirst({ orderBy: { date: "desc" }, select: { date: true } }),
		prisma.transaction.aggregate({
			_sum: { amount: true },
			where: { type: "CREDIT", date: { gte: monthStart, lt: nextMonthStart } },
		}),
		prisma.transaction.aggregate({
			_sum: { amount: true },
			where: { type: "DEBIT", date: { gte: monthStart, lt: nextMonthStart } },
		}),
		prisma.transaction.aggregate({
			_sum: { amount: true },
			where: { type: "CREDIT", date: { gte: prevMonthStart, lt: monthStart } },
		}),
		prisma.transaction.aggregate({
			_sum: { amount: true },
			where: { type: "DEBIT", date: { gte: prevMonthStart, lt: monthStart } },
		}),
		prisma.transaction.findMany({
			orderBy: { date: "desc" },
			take: 6,
			select: { id: true, date: true, type: true, amount: true, description: true, attended: true },
		}),
	]);

	const totalCredit = creditAgg._sum.amount ?? 0;
	const totalDebit = debitAgg._sum.amount ?? 0;
	const balance = totalCredit - totalDebit;
	const currentNet = (currentCreditAgg._sum.amount ?? 0) - (currentDebitAgg._sum.amount ?? 0);
	const prevNet = (prevCreditAgg._sum.amount ?? 0) - (prevDebitAgg._sum.amount ?? 0);
	const trendPercent = prevNet === 0 ? null : ((currentNet - prevNet) / Math.abs(prevNet)) * 100;

	const monthly: PublicMonthlyStat[] = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const start = new Date(d.getFullYear(), d.getMonth(), 1);
		const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

		const [creditMonth, debitMonth] = await Promise.all([
			prisma.transaction.aggregate({
				_sum: { amount: true },
				where: { type: "CREDIT", date: { gte: start, lte: end } },
			}),
			prisma.transaction.aggregate({
				_sum: { amount: true },
				where: { type: "DEBIT", date: { gte: start, lte: end } },
			}),
		]);

		const credit = creditMonth._sum.amount ?? 0;
		const debit = debitMonth._sum.amount ?? 0;

		monthly.push({
			label: format(d, "MMM", { locale: localeId }),
			month: d.getMonth() + 1,
			year: d.getFullYear(),
			credit,
			debit,
			net: credit - debit,
		});
	}

	return {
		metrics: {
			balance,
			totalCredit,
			totalDebit,
			creditCount,
			debitCount,
			transactionCount,
			period:
				firstTx?.date && lastTx?.date
					? `${format(firstTx.date, "d MMM", { locale: localeId })} - ${format(lastTx.date, "d MMM yyyy", { locale: localeId })}`
					: "Belum ada data",
			currentNet,
			trendPercent,
			lastDate: lastTx?.date ?? null,
		},
		monthly,
		recent,
	};
}
