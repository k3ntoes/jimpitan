import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
	return (
		<Card className="bg-white border-gray-200">
			<CardContent className="p-5">
				<div className="flex items-center justify-between mb-3">
					<Skeleton className="h-4 w-24 bg-gray-200" />
					<Skeleton className="h-8 w-8 rounded-lg bg-gray-200" />
				</div>
				<Skeleton className="h-7 w-32 bg-gray-200" />
			</CardContent>
		</Card>
	);
}

export function ChartSkeleton() {
	return (
		<Card className="lg:col-span-2 bg-white border-gray-200">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 bg-gray-200" />
					<Skeleton className="h-5 w-48 bg-gray-200" />
				</div>
			</CardHeader>
			<CardContent>
				<Skeleton className="h-55 w-full bg-gray-200" />
			</CardContent>
		</Card>
	);
}

export function RecentTransactionsSkeleton() {
	return (
		<Card className="bg-white border-gray-200">
			<CardHeader className="pb-3">
				<Skeleton className="h-5 w-32 bg-gray-200" />
			</CardHeader>
			<CardContent className="space-y-3">
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
						<div className="space-y-2">
							<Skeleton className="h-5 w-16 bg-gray-200" />
							<Skeleton className="h-3 w-32 bg-gray-200" />
						</div>
						<Skeleton className="h-5 w-20 bg-gray-200" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export function DashboardSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-48 bg-gray-200" />
				<Skeleton className="h-4 w-64 bg-gray-200 mt-2" />
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<StatsCardSkeleton key={i} />
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<ChartSkeleton />
				<RecentTransactionsSkeleton />
			</div>
		</div>
	);
}
