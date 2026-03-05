import AppHeader from "@/components/layout/app-header";
import AppSidebar from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { verifySession } from "@/lib/dal";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await verifySession();

	return (
		<SidebarProvider>
			<AppSidebar session={session} />
			<SidebarInset>
				<AppHeader session={session} />
				<div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
