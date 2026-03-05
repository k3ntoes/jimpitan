"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Auth error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
				<div className="flex items-center gap-3 mb-6">
					<div className="p-2 bg-amber-100 rounded-full">
						<AlertTriangle className="h-6 w-6 text-amber-600" />
					</div>
					<h2 className="text-xl font-semibold text-slate-900">Kesalahan Autentikasi</h2>
				</div>

				<p className="text-slate-600 mb-6">Terjadi masalah saat memproses autentikasi. Silakan coba lagi.</p>

				<div className="bg-slate-50 p-4 rounded-lg mb-6">
					<p className="text-sm text-slate-600 font-mono wrap-break-word">
						{error.message || "Kesalahan tidak diketahui"}
					</p>
				</div>

				<div className="flex gap-3">
					<Button onClick={reset} className="flex-1">
						Coba Lagi
					</Button>
					<Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1">
						Kembali ke Beranda
					</Button>
				</div>
			</div>
		</div>
	);
}
