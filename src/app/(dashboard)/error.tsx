"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Dashboard error:", error);
	}, [error]);

	return (
		<div className="flex flex-1 items-center justify-center p-4">
			<Card className="max-w-md w-full">
				<CardHeader>
					<div className="flex items-center gap-2 text-red-600 mb-2">
						<AlertCircle className="h-5 w-5" />
						<CardTitle>Terjadi Kesalahan</CardTitle>
					</div>
					<CardDescription>Terjadi kesalahan saat memuat halaman dashboard.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="bg-slate-50 p-4 rounded-lg">
						<p className="text-sm text-slate-600 font-mono wrap-break-word">
							{error.message || "Kesalahan tidak diketahui"}
						</p>
						{error.digest && <p className="text-xs text-slate-500 mt-2">Error ID: {error.digest}</p>}
					</div>
					<div className="flex gap-3">
						<Button onClick={reset} className="flex-1">
							Coba Lagi
						</Button>
						<Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1">
							Kembali
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
