import { type NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const HARI = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUM'AT", "SABTU"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		await verifySession();
		const { id } = await params;
		const transaction = await prisma.transaction.findUnique({
			where: { id },
			include: { user: { select: { name: true } } },
		});
		if (!transaction) {
			return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
		}
		return NextResponse.json({ transaction });
	} catch {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		await verifySession();
		const { id } = await params;
		const body = await req.json();
		const { type, amount, date, description, attended } = body;

		const dateObj = new Date(date);
		const dayIndex = dateObj.getDay();
		const day = HARI[dayIndex];

		const transaction = await prisma.transaction.update({
			where: { id },
			data: {
				type,
				amount: parseInt(amount, 10),
				date: dateObj,
				day,
				description: description || null,
				attended: attended !== undefined ? attended : true,
			},
		});
		return NextResponse.json({ transaction });
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		await verifySession();
		const { id } = await params;
		await prisma.transaction.delete({ where: { id } });
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
