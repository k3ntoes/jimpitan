import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// Protected and public paths
const publicPaths = ["/api/public-summary"];
const protectedPaths = ["/dashboard", "/transaksi", "/laporan", "/pengaturan"];

export default async function proxy(req: NextRequest) {
	const path = req.nextUrl.pathname;

	// Allow public API routes
	if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
		return NextResponse.next();
	}

	const isProtectedRoute = protectedPaths.some((protectedPath) => path.startsWith(protectedPath));
	const isLoginRoute = path === "/login";

	// Read session from cookie (optimistic check, no DB call)
	const cookie = (await cookies()).get("session")?.value;
	const session = await decrypt(cookie);

	// Redirect to /login if not authenticated on protected route
	if (isProtectedRoute && !session?.userId) {
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	// Redirect to /dashboard if already logged in and trying to access login page
	if (isLoginRoute && session?.userId) {
		return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (images, etc.)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
	],
};
