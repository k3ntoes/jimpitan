"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Transaction } from "@/lib/definitions";
import { useCreateTransaction, useUpdateTransaction } from "@/lib/queries";
import { formatAmount, parseAmount } from "@/lib/utils";

const formSchema = z.object({
	type: z.enum(["CREDIT", "DEBIT"]),
	amount: z.string().min(1, "Jumlah harus diisi"),
	date: z.string().min(1, "Tanggal harus diisi"),
	description: z.string().optional(),
	attended: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transaction?: Transaction | null;
	onSuccess?: () => void;
}

export default function TransactionDialog({ open, onOpenChange, transaction, onSuccess }: TransactionDialogProps) {
	const isEdit = !!transaction;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: "CREDIT",
			amount: "",
			date: format(new Date(), "yyyy-MM-dd"),
			description: "",
			attended: "true",
		},
	});

	useEffect(() => {
		if (transaction) {
			form.reset({
				type: transaction.type,
				amount: formatAmount(String(transaction.amount)),
				date: format(new Date(transaction.date), "yyyy-MM-dd"),
				description: transaction.description || "",
				attended: String(transaction.attended),
			});
		} else {
			form.reset({
				type: "CREDIT",
				amount: "",
				date: format(new Date(), "yyyy-MM-dd"),
				description: "",
				attended: "true",
			});
		}
	}, [transaction, form]);

	const createMutation = useCreateTransaction({
		onSuccess: () => {
			onOpenChange(false);
			onSuccess?.();
		},
	});

	const updateMutation = useUpdateTransaction({
		onSuccess: () => {
			onOpenChange(false);
			onSuccess?.();
		},
	});

	const onSubmit = (values: FormValues) => {
		const amount = parseAmount(values.amount);
		const data = {
			type: values.type as "CREDIT" | "DEBIT",
			amount,
			date: values.date,
			description: values.description,
			attended: values.attended === "true",
		};

		if (isEdit && transaction) {
			updateMutation.mutate({ id: transaction.id, ...data });
		} else {
			createMutation.mutate(data);
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-white border-gray-200 max-w-[calc(100vw-2rem)] sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-gray-900">{isEdit ? "Edit Transaksi" : "Tambah Transaksi"}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						{/* Tipe */}
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-700">Tipe Transaksi</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
										<FormControl>
											<SelectTrigger className="bg-white border-gray-300">
												<SelectValue placeholder="Pilih tipe" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white border-gray-200">
											<SelectItem value="CREDIT">↑ Kredit (Pemasukan / Setoran)</SelectItem>
											<SelectItem value="DEBIT">↓ Debit (Pengeluaran)</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>

						{/* Jumlah */}
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-700">Jumlah (Rp)</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="0"
											className="bg-white border-gray-300 placeholder:text-gray-400"
											onChange={(e) => {
												const formatted = formatAmount(e.target.value);
												if (e.target.value === "") {
													field.onChange("");
												} else {
													field.onChange(formatted);
												}
											}}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>

						{/* Tanggal */}
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-700">Tanggal</FormLabel>
									<FormControl>
										<Input {...field} type="date" className="bg-white border-gray-300" />
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>

						{/* Status Hadir */}
						<FormField
							control={form.control}
							name="attended"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-700">Status Setor</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
										<FormControl>
											<SelectTrigger className="bg-white border-gray-300">
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="bg-white border-gray-200">
											<SelectItem value="true">✓ Hadir / Setor</SelectItem>
											<SelectItem value="false">✗ Tidak Hadir</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>

						{/* Keterangan */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-700">
										Keterangan <span className="text-gray-500 font-normal">(opsional)</span>
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Contoh: Gula 10.000, Kopi 20.000"
											className="bg-white border-gray-300 placeholder:text-gray-400 resize-none"
											rows={2}
										/>
									</FormControl>
									<FormMessage className="text-red-400" />
								</FormItem>
							)}
						/>

						<DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
							<Button
								type="button"
								variant="ghost"
								onClick={() => onOpenChange(false)}
								className="text-gray-600 hover:text-gray-900"
							>
								Batal
							</Button>
							<Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white" disabled={isLoading}>
								{isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
								{isEdit ? "Simpan Perubahan" : "Tambah Transaksi"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
