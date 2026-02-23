import type { Metadata } from "next";
import TransaksiClient from "@/components/transaksi/transaksi-client";

export const metadata: Metadata = {
	title: "Transaksi - Jimpitan Ronda",
};

export default function TransaksiPage() {
	return <TransaksiClient />;
}
