import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getSession, type SessionPayload } from "./session";

export const verifySession = cache(async (): Promise<SessionPayload> => {
	const session = await getSession();
	if (!session?.userId) {
		redirect("/login");
	}
	return session;
});
