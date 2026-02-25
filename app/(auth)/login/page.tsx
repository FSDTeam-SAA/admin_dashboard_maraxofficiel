"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setIsLoading(false);

    if (response?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Login successful");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthPanel
      title="Login To Your Account"
      subtitle="Please enter your email and password to continue"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-700)]" />
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="pl-12"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-700)]" />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="pl-12"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-lg font-medium text-[var(--brand-700)] transition-opacity hover:opacity-80"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="h-12 w-full text-xl" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </AuthPanel>
  );
}
