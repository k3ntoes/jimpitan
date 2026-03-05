import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type SessionPayload = {
	userId: string;
	username: string;
	name: string;
	role: string;
	expiresAt: Date;
};

const secretKey = process.env.AUTH_SECRET ?? "";
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
	return new SignJWT({
		userId: payload.userId,
		username: payload.username,
		name: payload.name,
		role: payload.role,
		expiresAt: payload.expiresAt,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ["HS256"],
		});
		return payload as unknown as SessionPayload;
	} catch {
		return null;
	}
}

export async function createSession(user: { id: string; username: string; name: string; role: string }) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const session = await encrypt({
		userId: user.id,
		username: user.username,
		name: user.name,
		role: user.role,
		expiresAt,
	});

	const cookieStore = await cookies();
	cookieStore.set("session", session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
}

export async function getSession(): Promise<SessionPayload | null> {
	const cookieStore = await cookies();
	const cookie = cookieStore.get("session")?.value;
	if (!cookie) return null;
	return decrypt(cookie);
}
