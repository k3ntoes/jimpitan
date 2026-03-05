import { NextResponse } from "next/server";
import { getPublicSummary } from "@/lib/public-summary";

// Route segment config for better performance
export const dynamic = "force-dynamic";
export const revalidate = 900; // Revalidate every 15 minutes

export async function GET() {
	try {
		const data = await getPublicSummary();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch public summary", error);
		return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
	}
}
