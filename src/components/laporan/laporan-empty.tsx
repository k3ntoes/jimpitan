import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LaporanEmptyProps {
	monthLabel: string;
	year: string;
}

export function LaporanEmpty({ monthLabel, year }: LaporanEmptyProps) {
	return (
		<Card className="bg-white border-gray-200 shadow-md">
			<CardContent className="py-20">
				<div className="flex flex-col items-center justify-center text-center">
					<div className="p-4 rounded-full bg-gray-100 mb-4">
						<BookOpen className="w-12 h-12 text-gray-300" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-1">Belum Ada Data</h3>
					<p className="text-sm text-gray-500 max-w-md">
						Tidak ada data laporan untuk periode {monthLabel} {year}. Silakan pilih periode lain atau tambah transaksi terlebih dahulu.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
