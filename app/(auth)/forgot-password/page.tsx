"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword, getApiErrorMessage } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP sent successfully");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ email });
  };

  return (
    <AuthPanel
      title="Forgot Password"
      subtitle="Enter your registered email address. we’ll send you a code to reset your password."
      className="max-w-[620px]"
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

        <Button type="submit" className="h-12 w-full text-xl" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </AuthPanel>
  );
}
