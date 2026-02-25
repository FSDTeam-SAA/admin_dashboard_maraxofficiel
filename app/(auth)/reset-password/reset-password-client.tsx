"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage, resetPassword } from "@/lib/api";

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !otp) {
      toast.error("OTP session expired. Please request OTP again.");
      router.push("/forgot-password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password must match");
      return;
    }

    mutation.mutate({ email, otp, password });
  };

  return (
    <AuthPanel title="Reset Password" className="max-w-[620px]">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-700)]" />
            <Input
              id="password"
              type="password"
              placeholder="New Password"
              className="pl-12"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-700)]" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              className="pl-12"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="h-12 w-full text-xl" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Continue"}
        </Button>
      </form>
    </AuthPanel>
  );
}
