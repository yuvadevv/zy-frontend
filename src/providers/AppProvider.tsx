"use client";
import * as React from "react";
import { QueryProvider } from "./QueryProvider";
import { ErrorBoundary } from "./ErrorBoundary";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { StudentProvider } from "@/features/student/providers/StudentProvider";
import { OnboardingProvider } from "@/features/student/providers/OnboardingProvider";
export function AppProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('PWA Service Worker registered with scope: ', registration.scope);
          },
          (err) => {
            console.error('PWA Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);

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