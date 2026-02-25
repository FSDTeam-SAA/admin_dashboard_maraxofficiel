"use client";

import { KeyboardEvent, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthPanel } from "@/components/auth/auth-panel";
import { Button } from "@/components/ui/button";
import { forgotPassword, getApiErrorMessage, verifyOtp } from "@/lib/api";

const OTP_LENGTH = 6;

export function VerifyOtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const email = searchParams.get("email") || "";

  const otp = useMemo(() => otpValues.join(""), [otpValues]);

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      toast.success("OTP verified");
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const resendMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP sent again");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const updateOtp = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otpValues];
    next[index] = value;
    setOtpValues(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (!email) {
      toast.error("Email not found. Please request OTP again.");
      router.push("/forgot-password");
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      toast.error("Enter the complete OTP");
      return;
    }

    verifyMutation.mutate({ email, otp });
  };

  return (
    <AuthPanel title="Enter OTP" className="max-w-[620px]">
      <div className="space-y-6">
        <div className="flex justify-center gap-3 md:gap-4">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              value={value}
              onChange={(event) => updateOtp(event.target.value, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              maxLength={1}
              className="h-16 w-14 rounded-xl border border-[var(--border-strong)] bg-white text-center text-4xl font-semibold text-[var(--text-primary)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--brand-400)] md:w-16"
            />
          ))}
        </div>

        <p className="text-center text-xl text-[var(--text-primary)]">
          Didn&apos;t Receive OTP?{" "}
          <button
            type="button"
            className="font-semibold text-[var(--brand-700)]"
            onClick={() => resendMutation.mutate({ email })}
            disabled={resendMutation.isPending}
          >
            RESEND OTP
          </button>
        </p>

        <Button
          type="button"
          className="h-12 w-full text-xl"
          disabled={verifyMutation.isPending}
          onClick={handleVerify}
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </AuthPanel>
  );
}
