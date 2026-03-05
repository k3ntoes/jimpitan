import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			{/* Stats Cards Skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }, (_, i) => i).map((idx) => (
					<Card key={`stat-skeleton-${idx}`}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4 rounded" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-32 mb-2" />
							<Skeleton className="h-3 w-24" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts Skeleton */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="h-5 w-32 mb-2" />
						<Skeleton className="h-4 w-48" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-75 w-full" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-5 w-32 mb-2" />
						<Skeleton className="h-4 w-48" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-75 w-full" />
					</CardContent>
				</Card>
			</div>

			{/* Table Skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-40 mb-2" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent className="space-y-3">
					{Array.from({ length: 5 }, (_, i) => i).map((idx) => (
						<Skeleton key={`row-skeleton-${idx}`} className="h-12 w-full" />
					))}
				</CardContent>
			</Card>
		</div>
	);
}
