"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/features/auth/authThunk";
import { toaster } from "@/utils";
import { selectIsLoadingLogin } from "@/features/auth/selectors";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  // Redirect if user is already authenticated
  const { isAuthenticated } = useGuestOnly();

  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useAppSelector(selectIsLoadingLogin);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Show loading while checking authentication
  if (isAuthenticated === undefined) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: LoginFormData) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.rejected.match(result)) {
      setError("root", {
        message: result.payload || "Invalid email or password",
      });

      toaster({
        title: "Login Failed",
        message: result.payload || "Something went wrong.",
        icon: "error",
        className: "bg-red-50",
      });
    } else {
      console.log("Logged in user:", result.payload);
      toaster({
        title: "Login Successful",
        message: "You've successfully logged in!",
        icon: "success",
        className: "bg-green-50",
      });
      router.replace("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      action={"POST"}
      className="space-y-4"
    >
      {errors.root && (
        <Alert variant="destructive">
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <Label htmlFor="remember" className="text-sm text-gray-600">
            Remember me
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-orange-600 hover:text-orange-500"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {"Don't have an account? "}
          <Link
            href="/signup"
            className="text-orange-600 hover:text-orange-500 font-medium"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </form>
  );
}
