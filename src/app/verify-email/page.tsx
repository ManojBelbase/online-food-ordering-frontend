"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setStatus("error");
          return;
        }

        await axios.get(
          `https:/https://food-ordering-backend-36ba.vercel.app/api/v1/auth/verify-email?token=${token}`
        );

        setStatus("success");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Verification error:", error?.message || error);
          console.error("Verification failed:", error);
          setStatus("error");
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="p-4 text-center">
      {status === "verifying" && <p>Verifying your email...</p>}
      {status === "success" && <p>Email verified successfully! 🎉</p>}
      {status === "error" && <p>Invalid or expired token.</p>}
    </div>
  );
}
