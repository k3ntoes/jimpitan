import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { SummaryCard } from "@/hooks/use-laporan-data";

interface LaporanSummaryCardsProps {
	cards: SummaryCard[];
}

export function LaporanSummaryCards({ cards }: LaporanSummaryCardsProps) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
			{cards.map((card) => {
				const Icon = card.icon;
				return (
					<Card
						key={card.title}
						className={`bg-white border ${card.border} shadow-md relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
					>
						<div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
							<Icon className={`w-28 h-28 ${card.color}`} />
						</div>
						<CardContent className="p-5 relative z-10">
							<div className={`p-2.5 rounded-xl ${card.bg} backdrop-blur-sm ring-1 ring-gray-200 w-fit mb-3`}>
								<Icon className={`w-5 h-5 ${card.color}`} />
							</div>
							<p className="text-gray-600 text-[10px] font-medium tracking-wide uppercase mb-1">{card.title}</p>
							<p className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">{formatCurrency(card.value)}</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
