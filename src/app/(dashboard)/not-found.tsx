import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardNotFound() {
	return (
		<div className="flex flex-1 items-center justify-center p-4">
			<Card className="max-w-md w-full text-center">
				<CardHeader>
					<div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
						<FileQuestion className="w-8 h-8 text-slate-600" />
					</div>
					<CardTitle className="text-3xl">404</CardTitle>
					<CardDescription className="text-base">Halaman dashboard tidak ditemukan</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-slate-600 mb-6">Halaman yang Anda cari tidak tersedia di area dashboard.</p>
					<div className="flex gap-3">
						<Button asChild className="flex-1">
							<Link href="/dashboard">Dashboard Utama</Link>
						</Button>
						<Button asChild variant="outline" className="flex-1">
							<Link href="/">Beranda</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
