"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { SessionPayload } from "@/lib/session";

interface AppHeaderProps {
	session: SessionPayload;
}

export default function AppHeader({ session }: AppHeaderProps) {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4" />
			<div className="flex flex-1 items-center justify-between">
				<div>
					<p className="text-sm text-muted-foreground">
						Selamat datang, <span className="font-medium text-foreground">{session.name}</span>
					</p>
				</div>
			</div>
		</header>
	);
}
