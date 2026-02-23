import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
	try {
		const session = await verifySession();
		const body = await req.json();
		const { currentPassword, newPassword } = body;

		if (!currentPassword || !newPassword) {
			return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
		}

		// Get current user
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
		});

		if (!user) {
			return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
		}

		// Verify current password
		const passwordMatch = await bcrypt.compare(currentPassword, user.password);
		if (!passwordMatch) {
			return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 });
		}

		// Hash new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update password
		await prisma.user.update({
			where: { id: session.userId },
			data: { password: hashedPassword },
		});

		return NextResponse.json({ message: "Password berhasil diubah" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
