import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export const metadata: Metadata = {
	title: "Dashboard - Jimpitan Ronda",
};

export default function DashboardPage() {
	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<DashboardClient />
		</Suspense>
	);
}
