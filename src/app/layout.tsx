import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
	title: {
		default: "Jimpitan Ronda",
		template: "%s | Jimpitan Ronda",
	},
	description: "Aplikasi pencatatan iuran jimpitan ronda warga dengan transparansi keuangan real-time",
	keywords: ["jimpitan", "ronda", "iuran warga", "keuangan", "kas rt"],
	authors: [{ name: "Jimpitan Ronda" }],
	creator: "Jimpitan Ronda",
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
	openGraph: {
		type: "website",
		locale: "id_ID",
		url: "/",
		title: "Jimpitan Ronda",
		description: "Aplikasi pencatatan iuran jimpitan ronda warga dengan transparansi keuangan real-time",
		siteName: "Jimpitan Ronda",
	},
	twitter: {
		card: "summary_large_image",
		title: "Jimpitan Ronda",
		description: "Aplikasi pencatatan iuran jimpitan ronda warga dengan transparansi keuangan real-time",
	},
	robots: {
		index: true,
		follow: true,
	},
	manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="id">
			<body className={inter.className}>
				<ReactQueryProvider>
					{children}
					<Toaster richColors position="top-right" />
				</ReactQueryProvider>
			</body>
		</html>
	);
}
