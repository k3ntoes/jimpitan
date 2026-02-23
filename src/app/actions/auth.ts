"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { type LoginFormState, LoginSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export async function login(_state: LoginFormState, formData: FormData): Promise<LoginFormState> {
	// 1. Validate form fields
	const validatedFields = LoginSchema.safeParse({
		username: formData.get("username"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { username, password } = validatedFields.data;

	// 2. Find user in database
	const user = await prisma.user.findUnique({
		where: { username },
	});

	if (!user) {
		return { message: "Username atau password salah" };
	}

	// 3. Verify password
	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) {
		return { message: "Username atau password salah" };
	}

	// 4. Create session
	await createSession({
		id: user.id,
		username: user.username,
		name: user.name,
		role: user.role,
	});

	redirect("/dashboard");
}

export async function logout() {
	await deleteSession();
	redirect("/login");
}
