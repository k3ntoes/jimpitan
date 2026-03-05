/**
 * Reusable React Query Hooks
 */

import { type UseMutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LaporanData, TransactionListResponse } from "./definitions";

// ============= Query Functions =============

export async function fetchSummary() {
	const response = await fetch("/api/summary");
	if (!response.ok) throw new Error("Failed to fetch summary");
	return response.json();
}

export async function fetchTransactions(typeFilter = "ALL", page = 1, limit = 15, month?: string, year?: string) {
	const params = new URLSearchParams();
	if (typeFilter !== "ALL") params.set("type", typeFilter);
	params.set("page", page.toString());
	params.set("limit", limit.toString());
	if (month) params.set("month", month);
	if (year) params.set("year", year);

	const response = await fetch(`/api/transactions?${params.toString()}`);
	if (!response.ok) throw new Error("Failed to fetch transactions");
	return response.json() as Promise<TransactionListResponse>;
}

export async function fetchLaporan(year: string, month: string) {
	const response = await fetch(`/api/laporan?year=${year}&month=${month}`);
	if (!response.ok) throw new Error("Failed to fetch laporan");
	return response.json() as Promise<LaporanData>;
}

// ============= Query Hooks =============

export function useSummary() {
	return useQuery({
		queryKey: ["summary"],
		queryFn: fetchSummary,
	});
}

export function useTransactions(typeFilter = "ALL", page = 1, limit = 15, month?: string, year?: string) {
	return useQuery({
		queryKey: ["transactions", typeFilter, page, month, year],
		queryFn: () => fetchTransactions(typeFilter, page, limit, month, year),
	});
}

export function useLaporan(year: string, month: string) {
	return useQuery<LaporanData>({
		queryKey: ["laporan", year, month],
		queryFn: () => fetchLaporan(year, month),
	});
}

// ============= Mutation Functions =============

interface CreateTransactionData {
	type: "CREDIT" | "DEBIT";
	amount: number;
	date: string;
	description?: string;
	attended: boolean;
}

interface UpdateTransactionData extends CreateTransactionData {
	id: string;
}

export async function createTransaction(data: CreateTransactionData) {
	const response = await fetch("/api/transactions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error("Failed to create transaction");
	return response.json();
}

export async function updateTransaction({ id, ...data }: UpdateTransactionData) {
	const response = await fetch(`/api/transactions/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error("Failed to update transaction");
	return response.json();
}

export async function deleteTransaction(id: string) {
	const response = await fetch(`/api/transactions/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) throw new Error("Failed to delete transaction");
	return response.json();
}

// ============= Mutation Hooks =============

export function useCreateTransaction(options?: UseMutationOptions<unknown, Error, CreateTransactionData>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["summary"] });
			toast.success("Transaksi berhasil ditambahkan");
		},
		onError: () => {
			toast.error("Gagal menambahkan transaksi");
		},
		...options,
	});
}

export function useUpdateTransaction(options?: UseMutationOptions<unknown, Error, UpdateTransactionData>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["summary"] });
			toast.success("Transaksi berhasil diupdate");
		},
		onError: () => {
			toast.error("Gagal mengupdate transaksi");
		},
		...options,
	});
}

export function useDeleteTransaction(options?: UseMutationOptions<unknown, Error, string>) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTransaction,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			queryClient.invalidateQueries({ queryKey: ["summary"] });
			toast.success("Transaksi berhasil dihapus");
		},
		onError: () => {
			toast.error("Gagal menghapus transaksi");
		},
		...options,
	});
}
