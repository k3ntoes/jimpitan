"use client";

import { Loader2, ShieldCheck } from "lucide-react";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
	const [state, formAction, isPending] = useActionState(login, undefined);

	return (
		<div className="w-full max-w-md">
			{/* Logo / Branding */}
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-2xl shadow-blue-600/40 mb-4">
					<ShieldCheck className="w-8 h-8 text-white" />
				</div>
				<h1 className="text-3xl font-bold text-white tracking-tight">Jimpitan Ronda</h1>
				<p className="text-blue-300 mt-1 text-sm">Sistem Pencatatan Iuran Warga</p>
			</div>

			<Card className="border-blue-800/30 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
				<CardHeader className="pb-4">
					<CardTitle className="text-white text-xl">Masuk</CardTitle>
					<CardDescription className="text-slate-400">Masukkan username dan password Anda</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction} className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="username" className="text-slate-300">
								Username
							</Label>
							<Input
								id="username"
								name="username"
								type="text"
								placeholder="Masukkan username"
								className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
								disabled={isPending}
								required
							/>
							{state?.errors?.username && <p className="text-red-400 text-sm">{state.errors.username[0]}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-slate-300">
								Password
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Masukkan password"
								className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
								disabled={isPending}
								required
							/>
							{state?.errors?.password && <p className="text-red-400 text-sm">{state.errors.password[0]}</p>}
						</div>

						{state?.message && (
							<div className="rounded-lg bg-red-950/50 border border-red-800/50 px-4 py-3">
								<p className="text-red-400 text-sm text-center">{state.message}</p>
							</div>
						)}

						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 transition-all shadow-lg shadow-blue-600/30"
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Memproses...
								</>
							) : (
								"Masuk"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>

			<p className="text-center text-slate-600 text-xs mt-6">© 2026 Jimpitan Ronda · Sistem Pencatatan Iuran Warga</p>
		</div>
	);
}
