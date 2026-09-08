"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { fetchBootstrapConfig } from "../services/bootstrapService";
import { SplashScreen } from "./SplashScreen";
import { MaintenanceScreen } from "./MaintenanceScreen";
import { ComingSoonScreen } from "./ComingSoonScreen";
import { ForceUpdateScreen } from "./ForceUpdateScreen";
import { NoInternetScreen } from "./NoInternetScreen";

export function BootstrapGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOffline, setIsOffline] = React.useState(false);
  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => { window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); };
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["bootstrap"],
    queryFn: fetchBootstrapConfig,
    staleTime: 1000 * 60, // 1 minute caching
    refetchInterval: 1000 * 60 * 5, // Polling every 5 minutes
  });

  const [dismissedComingSoon, setDismissedComingSoon] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('dismissedComingSoon') === 'true') {
      setDismissedComingSoon(true);
    }
  }, []);

  const isAdminOrVendor = pathname?.startsWith('/admin') || pathname?.startsWith('/vendor');

  const isPublicRoute = !pathname?.startsWith('/app') && !isAdminOrVendor;

  const handleDismiss = () => {
    setDismissedComingSoon(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dismissedComingSoon', 'true');
    }
    if (!isPublicRoute) {
      window.location.href = '/';
    }
  };

  if (isOffline) return <NoInternetScreen />;
  if (isLoading) {
    if (isPublicRoute) return <>{children}</>;
    return <SplashScreen />;
  }
  if (isError) return <SplashScreen />; // Or generic retry screen
  if (data?.data.maintenance && !isAdminOrVendor) return <MaintenanceScreen />;
  if (data?.data.coming_soon && !isAdminOrVendor) {
    if (isPublicRoute && dismissedComingSoon) {
      return <>{children}</>;
    }
    return <ComingSoonScreen onDismiss={handleDismiss} />;
  }
  if (data?.data.force_update && !isAdminOrVendor) return <ForceUpdateScreen />;
  return <>{children}</>;
}
