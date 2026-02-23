import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
	log: ["error", "warn"],
});

const HARI = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUM'AT", "SABTU"];

async function main() {
	console.log("🌱 Starting database seed...");

	// Buat user admin
	const hashedPassword = await bcrypt.hash("admin123", 10);
	const user = await prisma.user.upsert({
		where: { username: "admin" },
		update: {},
		create: {
			username: "admin",
			name: "Administrator",
			password: hashedPassword,
			role: "admin",
		},
	});
	console.log("✅ Admin user created:", user.username);

	// Hapus transaksi lama
	await prisma.transaction.deleteMany({});
	console.log("🗑️  Cleared existing transactions");

	// Data setoran harian (CREDIT) dari foto
	const creditData = [
		// Minggu 1 (18–24 Januari 2026)
		{ date: new Date(2026, 0, 18), amount: 8000, description: null },
		{ date: new Date(2026, 0, 19), amount: 5200, description: "Gula 10.000" },
		{ date: new Date(2026, 0, 20), amount: 11500, description: "Kopi 20.000" },
		{ date: new Date(2026, 0, 21), amount: 5200, description: "Tokon Iapiring 53.500" },
		{ date: new Date(2026, 0, 22), amount: 13100, description: null },
		{ date: new Date(2026, 0, 23), amount: 8000, description: "Tokon pas Rondg 53.500" },
		{ date: new Date(2026, 0, 24), amount: 7500, description: null },

		// Minggu 2 (25–31 Januari 2026)
		{ date: new Date(2026, 0, 25), amount: 8000, description: "Kopi 10.000" },
		{ date: new Date(2026, 0, 26), amount: 7500, description: "Teh 5.000" },
		{ date: new Date(2026, 0, 27), amount: 10000, description: "Calon 7.000" },
		{ date: new Date(2026, 0, 28), amount: 11900, description: null },
		{ date: new Date(2026, 0, 29), amount: 10500, description: null },
		{ date: new Date(2026, 0, 30), amount: 11000, description: null },
		{ date: new Date(2026, 0, 31), amount: 11000, description: null },

		// Minggu 3 (1–7 Februari 2026)
		{ date: new Date(2026, 1, 1), amount: 9500, description: "Gula 10.000" },
		{ date: new Date(2026, 1, 2), amount: 8200, description: "Kopi 10.000" },
		{ date: new Date(2026, 1, 3), amount: 10400, description: null },
		{ date: new Date(2026, 1, 4), amount: 14300, description: null },
		{ date: new Date(2026, 1, 5), amount: 7000, description: null },
		{ date: new Date(2026, 1, 6), amount: 9000, description: null },
		{ date: new Date(2026, 1, 7), amount: 9000, description: null },

		// Minggu 4 (8–13 Februari 2026) — 14 Februari kosong
		{ date: new Date(2026, 1, 8), amount: 8500, description: "Kopi 10.000" },
		{ date: new Date(2026, 1, 9), amount: 10700, description: "Gula 10.000" },
		{ date: new Date(2026, 1, 10), amount: 10000, description: null },
		{ date: new Date(2026, 1, 11), amount: 10000, description: "minggu15/2=26" }, // catatan, bukan pengeluaran
		{ date: new Date(2026, 1, 12), amount: 14000, description: "Tolon 55.500" },
		{ date: new Date(2026, 1, 13), amount: 14000, description: "Gula+lapis=20.000" },
	];

	// Fungsi ekstrak angka dari deskripsi (misal "Gula 10.000" → 10000)
	function extractAmountFromDesc(desc: string): number | null {
		const match = desc.match(/(\d+[.]?\d*)/);
		if (!match) return null;
		const numStr = match[0].replace(/\./g, "");
		return parseInt(numStr, 10);
	}

	// Kumpulkan semua transaksi (CREDIT + DEBIT)
	const transactions = [];

	for (const credit of creditData) {
		// Tambahkan setoran (CREDIT)
		transactions.push({
			date: credit.date,
			type: "CREDIT" as const,
			amount: credit.amount,
			description: credit.description || null,
			attended: true,
		});

		// Jika ada deskripsi yang mengandung angka dan bukan catatan khusus, buat pengeluaran (DEBIT)
		if (credit.description) {
			const desc = credit.description;
			// Lewati catatan yang bukan pengeluaran (misal "minggu15/2=26")
			if (desc.includes("minggu") || desc.includes("=")) continue;

			const amount = extractAmountFromDesc(desc);
			if (amount) {
				transactions.push({
					date: credit.date,
					type: "DEBIT" as const,
					amount,
					description: desc,
					attended: false, // tidak relevan untuk DEBIT
				});
			}
		}
	}

	// Urutkan berdasarkan tanggal
	transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

	// Simpan ke database
	for (const t of transactions) {
		const dayIndex = t.date.getDay();
		const day = HARI[dayIndex];

		await prisma.transaction.create({
			data: {
				date: t.date,
				day,
				type: t.type,
				amount: t.amount,
				description: t.description,
				attended: t.attended,
				userId: user.id,
			},
		});
	}

	console.log(
		`✅ Created ${transactions.length} transactions (${transactions.filter((t) => t.type === "CREDIT").length} credits, ${transactions.filter((t) => t.type === "DEBIT").length} debits)`,
	);

	// Hitung saldo akhir
	const totalCredit = transactions.filter((t) => t.type === "CREDIT").reduce((sum, t) => sum + t.amount, 0);
	const totalDebit = transactions.filter((t) => t.type === "DEBIT").reduce((sum, t) => sum + t.amount, 0);
	const balance = totalCredit - totalDebit;

	console.log(`💰 Total Pemasukan: Rp ${totalCredit.toLocaleString("id-ID")}`);
	console.log(`💰 Total Pengeluaran: Rp ${totalDebit.toLocaleString("id-ID")}`);
	console.log(`💰 Saldo Akhir: Rp ${balance.toLocaleString("id-ID")}`);

	console.log("🎉 Seed completed successfully!");
}

main()
	.catch((e) => {
		console.error("❌ Seed failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
