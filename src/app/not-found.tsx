import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
			<div className="max-w-md w-full text-center">
				<div className="mb-8">
					<div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
						<FileQuestion className="w-12 h-12 text-indigo-600" />
					</div>
					<h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
					<h2 className="text-2xl font-semibold text-slate-800 mb-2">Halaman Tidak Ditemukan</h2>
					<p className="text-slate-600 mb-8">
						Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Button asChild size="lg">
						<Link href="/" className="gap-2">
							<Home className="h-4 w-4" />
							Kembali ke Beranda
						</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link href="/dashboard">Dashboard</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
