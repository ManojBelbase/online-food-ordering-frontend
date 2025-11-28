"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // If you're using shadcn or Tailwind

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
      <Link href="/">
        <Button className="cursor-pointer">Go back home</Button>
      </Link>
    </div>
  );
}
