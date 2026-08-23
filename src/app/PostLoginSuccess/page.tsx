"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostLoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/app/home");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Login Successful!</h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          Redirecting to Dashboard...
        </p>
      </div>
    </div>
  );
}