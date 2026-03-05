/**
 * Reusable Constants
 */

export const TRANSACTION_TYPES = {
	CREDIT: "CREDIT",
	DEBIT: "DEBIT",
} as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

export const MONTHS = [
	{ value: "1", label: "Januari" },
	{ value: "2", label: "Februari" },
	{ value: "3", label: "Maret" },
	{ value: "4", label: "April" },
	{ value: "5", label: "Mei" },
	{ value: "6", label: "Juni" },
	{ value: "7", label: "Juli" },
	{ value: "8", label: "Agustus" },
	{ value: "9", label: "September" },
	{ value: "10", label: "Oktober" },
	{ value: "11", label: "November" },
	{ value: "12", label: "Desember" },
] as const;

/**
 * Generate array of years from current year backwards
 * @param count Number of years to generate (default: 5)
 * @returns Array of year numbers
 */
export function generateYears(count = 5): number[] {
	const currentYear = new Date().getFullYear();
	return Array.from({ length: count }, (_, i) => currentYear - i);
}

/**
 * Get current year and month
 */
export function getCurrentPeriod() {
	const now = new Date();
	return {
		year: now.getFullYear(),
		month: now.getMonth() + 1,
	};
}
