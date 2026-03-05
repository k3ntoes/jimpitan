import { z } from "zod";

// ============= Zod Schemas =============

export const LoginSchema = z.object({
	username: z.string().min(1, "Username harus diisi"),
	password: z.string().min(1, "Password harus diisi"),
});

export const TransactionSchema = z.object({
	type: z.enum(["CREDIT", "DEBIT"], {
		message: "Tipe transaksi harus dipilih",
	}),
	amount: z
		.string()
		.min(1, "Jumlah harus diisi")
		.transform((v) => parseInt(v.replace(/\D/g, ""), 10))
		.refine((v) => !Number.isNaN(v) && v > 0, "Jumlah harus lebih dari 0"),
	date: z.string().min(1, "Tanggal harus diisi"),
	description: z.string().optional(),
	attended: z.boolean().optional().default(true),
});

// ============= Form State Types =============

export type LoginFormState =
	| {
			errors?: {
				username?: string[];
				password?: string[];
			};
			message?: string;
	  }
	| undefined;

export type TransactionFormState =
	| {
			errors?: {
				type?: string[];
				amount?: string[];
				date?: string[];
				description?: string[];
			};
			message?: string;
			success?: boolean;
	  }
	| undefined;

// ============= Data Types =============

export interface Transaction {
	id: string;
	date: string;
	day: string;
	type: "CREDIT" | "DEBIT";
	amount: number;
	description?: string | null;
	attended: boolean;
}

export interface Week {
	weekNumber: number;
	weekKey: string;
	openingBalance: number;
	transactions: Transaction[];
	totalCredit: number;
	totalDebit: number;
	closingBalance: number;
}

export interface LaporanData {
	weeks: Week[];
	openingBalance: number;
	closingBalance: number;
}

export interface PaginationData {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface TransactionListResponse {
	transactions: Transaction[];
	pagination: PaginationData;
	currentBalance: number;
}

export interface WeeklyTransactionDetail {
	id: string;
	date: string;
	day: string;
	type: "CREDIT" | "DEBIT";
	amount: number;
	description?: string | null;
	attended: boolean;
}

export interface WeeklySummary {
	weekNumber: number;
	weekLabel: string;
	startDate: string;
	endDate: string;
	openingBalance: number;
	totalCredit: number;
	totalDebit: number;
	closingBalance: number;
	creditCount: number;
	debitCount: number;
	transactions: WeeklyTransactionDetail[];
}

export interface WeeklySummaryResponse {
	month: number;
	year: number;
	monthLabel: string;
	weeks: WeeklySummary[];
	openingBalance: number;
	closingBalance: number;
}
