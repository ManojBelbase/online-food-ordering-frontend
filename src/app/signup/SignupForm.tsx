"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { signupUser } from "@/features/auth/authThunk";
import { toaster } from "@/utils";
import { selectIsLoadingSignup } from "@/features/auth/selectors";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import { useRouter } from "next/navigation";

const signupSchema = z
  .object({
    name: z.string().min(2, "First name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 8 characters"),
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  // Redirect if user is already authenticated
  const { isAuthenticated } = useGuestOnly();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLoading = useAppSelector(selectIsLoadingSignup);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
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

  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await dispatch(signupUser(data));
      if (signupUser.rejected.match(result)) {
        setError("root", {
          message: result.payload || "Failed to create account. Try again.",
        });
        toaster({
          title: "Signup Failed",
          message: result.payload || "Something went wrong.",
          icon: "error",
          className: "bg-red-50",
        });
      } else {
        console.log("Account created!", result.payload);
        toaster({
          title: "Account Created",
          message:
            "You've successfully registered! please verify you email before login",
          icon: "success",
          className: "bg-green-50",
        });
        router.replace("/login");
      }
    } catch {
      setError("root", { message: "Something went wrong. Try again later." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <Alert variant="destructive">
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              placeholder="John Doe"
              className="pl-10"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="9841325637"
            className="pl-10"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="pl-10 pr-10"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeToTerms"
          checked={agreeToTerms}
          onCheckedChange={(checked) =>
            setValue("agreeToTerms", checked as boolean)
          }
        />
        <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
          I agree to the{" "}
          <Link href="/terms" className="text-orange-600 hover:text-orange-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-orange-600 hover:text-orange-500"
          >
            Privacy Policy
          </Link>
        </Label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-600 hover:text-orange-500 font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  );
}
