"use client";

import { useState } from "react";
import { toast } from "sonner";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PengaturanClient() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();

		if (newPassword !== confirmPassword) {
			toast.error("Password baru tidak cocok");
			return;
		}

		if (newPassword.length < 6) {
			toast.error("Password minimal 6 karakter");
			return;
		}

		setIsLoading(true);
		try {
			const res = await fetch("/api/user/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Gagal mengubah password");
			}

			toast.success("Password berhasil diubah");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error: unknown) {
			toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
		} catch {
			toast.error("Gagal logout");
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-xl sm:text-3xl font-bold tracking-tight">Pengaturan</h2>
				<p className="text-muted-foreground">Kelola akun dan preferensi Anda</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Profil</CardTitle>
						<CardDescription>Informasi akun Anda</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label className="text-muted-foreground">Username</Label>
							<p className="text-lg font-medium">admin</p>
						</div>
						<div>
							<Label className="text-muted-foreground">Role</Label>
							<p className="text-lg font-medium">Administrator</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Ubah Password</CardTitle>
						<CardDescription>Ganti password akun Anda</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleChangePassword} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="current-password">Password Saat Ini</Label>
								<Input
									id="current-password"
									type="password"
									value={currentPassword}
									onChange={(e) => setCurrentPassword(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="new-password">Password Baru</Label>
								<Input
									id="new-password"
									type="password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
								<Input
									id="confirm-password"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Menyimpan..." : "Ubah Password"}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Sesi</CardTitle>
						<CardDescription>Kelola sesi login Anda</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="destructive" onClick={handleLogout}>
							Logout
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
