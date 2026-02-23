import { type NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

// Route segment config - dynamic due to authentication and query params
export const dynamic = "force-dynamic";

const HARI = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUM'AT", "SABTU"];

export async function GET(req: NextRequest) {
	try {
		const _session = await verifySession();
		const { searchParams } = new URL(req.url);
		const type = searchParams.get("type"); // CREDIT, DEBIT, or null
		const month = searchParams.get("month");
		const year = searchParams.get("year");
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "20", 10);

		const where: Record<string, unknown> = {};
		if (type) where.type = type;
		if (month && year) {
			const start = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
			const end = new Date(parseInt(year, 10), parseInt(month, 10), 0, 23, 59, 59);
			where.date = { gte: start, lte: end };
		}

		const [transactions, total] = await Promise.all([
			prisma.transaction.findMany({
				where,
				orderBy: { date: "desc" },
				skip: (page - 1) * limit,
				take: limit,
				include: { user: { select: { name: true } } },
			}),
			prisma.transaction.count({ where }),
		]);

		// Calculate running balance (all time)
		const allTransactions = await prisma.transaction.findMany({
			orderBy: { date: "asc" },
			select: { type: true, amount: true },
		});
		let balance = 0;
		for (const t of allTransactions) {
			if (t.type === "CREDIT") balance += t.amount;
			else balance -= t.amount;
		}

		return NextResponse.json({
			transactions,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
			currentBalance: balance,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await verifySession();
		const body = await req.json();

		const { type, amount, date, description, attended } = body;

		if (!type || !amount || !date) {
			return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
		}

		const dateObj = new Date(date);
		const dayIndex = dateObj.getDay();
		const day = HARI[dayIndex];

		const transaction = await prisma.transaction.create({
			data: {
				type,
				amount: parseInt(amount, 10),
				date: dateObj,
				day,
				description: description || null,
				attended: attended !== undefined ? attended : true,
				userId: session.userId,
			},
		});

		return NextResponse.json({ transaction }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
