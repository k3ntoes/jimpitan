import type { Metadata } from "next";
import PengaturanClient from "@/components/pengaturan/pengaturan-client";

export const metadata: Metadata = {
	title: "Pengaturan - Jimpitan Ronda",
};

export default function PengaturanPage() {
	return <PengaturanClient />;
}
