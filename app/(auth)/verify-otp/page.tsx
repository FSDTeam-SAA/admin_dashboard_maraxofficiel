import { Suspense } from "react";
import { VerifyOtpClient } from "@/app/(auth)/verify-otp/verify-otp-client";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpClient />
    </Suspense>
  );
}
