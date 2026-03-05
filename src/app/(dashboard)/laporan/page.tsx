import type { Metadata } from "next";
import LaporanClient from "@/components/laporan/laporan-client";

export const metadata: Metadata = {
	title: "Laporan Mingguan - Jimpitan Ronda",
};

export default function LaporanPage() {
	return <LaporanClient />;
}
