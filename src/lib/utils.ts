import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format number as Indonesian Rupiah currency
 * @param value Amount to format
 * @returns Formatted currency string (e.g., "Rp 100.000")
 */
export function formatCurrency(value: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(value);
}

/**
 * Format number as compact Indonesian Rupiah (K, Jt, M)
 * @param amount Amount to format
 * @returns Compact currency string (e.g., "1.5jt", "2.3M")
 */
export function formatCompactRupiah(amount: number) {
	if (amount >= 1000000000) {
		return `${(amount / 1000000000).toFixed(1)}M`;
	}
	if (amount >= 1000000) {
		return `${(amount / 1000000).toFixed(1)}jt`;
	}
	if (amount >= 1000) {
		return `${(amount / 1000).toFixed(0)}rb`;
	}
	return amount.toString();
}

/**
 * Format input string as Indonesian number (with thousand separators)
 * @param value String value to format
 * @returns Formatted number string (e.g., "1.000.000")
 */
export function formatAmount(value: string) {
	const num = value.replace(/\D/g, "");
	return new Intl.NumberFormat("id-ID").format(parseInt(num, 10) || 0);
}

/**
 * Parse formatted amount string to number
 * @param value Formatted amount string
 * @returns Parsed number
 */
export function parseAmount(value: string): number {
	return parseInt(value.replace(/\D/g, ""), 10) || 0;
}
