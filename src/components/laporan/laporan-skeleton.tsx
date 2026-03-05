import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LaporanSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<Card key={i} className="bg-white border-gray-200 shadow-md">
						<CardContent className="p-6">
							<Skeleton className="h-10 w-10 rounded-xl mb-4" />
							<Skeleton className="h-3 w-20 mb-2" />
							<Skeleton className="h-7 w-28" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card className="bg-white border-gray-200 shadow-md">
				<CardContent className="pt-6">
					<Skeleton className="h-75 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
