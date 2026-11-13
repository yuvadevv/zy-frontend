"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { fetchBootstrapConfig, isTestingEnvironment } from "../services/bootstrapService";
import { SplashScreen } from "./SplashScreen";
import { MaintenanceScreen } from "./MaintenanceScreen";
import { ComingSoonScreen } from "./ComingSoonScreen";
import { ForceUpdateScreen } from "./ForceUpdateScreen";
import { NoInternetScreen } from "./NoInternetScreen";
import { FoodLockedScreen } from "./FoodLockedScreen";

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
    staleTime: 1000 * 15, // 15 seconds caching
    refetchInterval: 1000 * 60 * 2, // Polling every 2 minutes
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

  const isTesting = isTestingEnvironment();
  const isFoodLocked = data?.data 
    ? Boolean(data.data.is_food_locked_for_current_client) 
    : !isTesting;

  if (pathname?.startsWith('/app/campus-food') && isFoodLocked && !isAdminOrVendor) {
    return <FoodLockedScreen message={data?.data?.food_service_lock_message} />;
  }
  return <>{children}</>;
}
