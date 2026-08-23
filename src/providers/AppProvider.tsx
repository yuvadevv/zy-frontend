"use client";
import * as React from "react";
import { QueryProvider } from "./QueryProvider";
import { ErrorBoundary } from "./ErrorBoundary";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { StudentProvider } from "@/features/student/providers/StudentProvider";
import { OnboardingProvider } from "@/features/student/providers/OnboardingProvider";
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <StudentProvider>
            <OnboardingProvider>
              {children}
            </OnboardingProvider>
          </StudentProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}