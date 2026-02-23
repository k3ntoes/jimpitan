import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
	title: "Login - Jimpitan Ronda",
	description: "Masuk ke aplikasi pencatatan jimpitan ronda",
};

export default function LoginPage() {
	return <LoginForm />;
}
