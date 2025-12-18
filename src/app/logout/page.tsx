"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { toaster } from "@/utils";

export default function LogoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(logout());

    toaster({
      title: "Logged Out",
      message: "You have been successfully logged out.",
      icon: "success",
      className: "bg-green-50",
    });

    router.replace("/login");
  }, [dispatch, router]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}
