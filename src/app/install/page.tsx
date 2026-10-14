"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Share,
  PlusSquare,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  RotateCw,
  Sparkles,
  ArrowRight,
  Monitor,
  Loader2,
  Info,
  Bell,
} from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";

type InstallState =
  | "checking" // Initial evaluation window while waiting for browser beforeinstallprompt
  | "ready" // beforeinstallprompt captured, ready for one-tap install
  | "prompt_active" // Native browser prompt dialog is currently visible to user
  | "accepted_pending" // User tapped "Install" on native prompt, awaiting appinstalled confirmation
  | "accepted_unconfirmed" // Prompt was accepted, but appinstalled didn't fire within timeout
  | "installed" // Verified installed via appinstalled event in this session
  | "already_installed" // Verified opened inside standalone display-mode on mount or previously installed
  | "dismissed" // User dismissed/cancelled the native prompt
  | "ios_guide" // iOS device detected (Safari / iOS Add to Home Screen)
  | "manual_guide"; // Non-iOS browser where beforeinstallprompt was not dispatched

interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isChrome: boolean;
  isSafari: boolean;
  isEdge: boolean;
  isInApp: boolean;
  isStandalone: boolean;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installState, setInstallState] = useState<InstallState>("checking");
  const [platform, setPlatform] = useState<PlatformInfo>({
    isIOS: false,
    isAndroid: false,
    isDesktop: false,
    isChrome: false,
    isSafari: false,
    isEdge: false,
    isInApp: false,
    isStandalone: false,
  });

  const checkingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Detect platform characteristics
    const ua = typeof window !== "undefined" ? window.navigator.userAgent || "" : "";
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Mac") && typeof navigator !== "undefined" && navigator.maxTouchPoints > 1);
    const isAndroidDevice = /Android/i.test(ua);
    const isEdgeBrowser = /Edg\//i.test(ua);
    const isChromeBrowser = /Chrome|CriOS/i.test(ua) && !isEdgeBrowser;
    const isSafariBrowser = /Safari/i.test(ua) && !isChromeBrowser && !isEdgeBrowser;
    const isInAppBrowser = /FBAN|FBAV|Instagram|Line|WhatsApp|Snapchat/i.test(ua);

    const isStandaloneMode =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        (window.navigator as any).standalone === true ||
        (typeof document !== "undefined" && document.referrer.includes("android-app://")));

    const currentPlatform: PlatformInfo = {
      isIOS: isIOSDevice,
      isAndroid: isAndroidDevice,
      isDesktop: !isIOSDevice && !isAndroidDevice,
      isChrome: isChromeBrowser,
      isSafari: isSafariBrowser,
      isEdge: isEdgeBrowser,
      isInApp: isInAppBrowser,
      isStandalone: isStandaloneMode,
    };
    setPlatform(currentPlatform);

    // 2. If already running in standalone mode, mark as already installed immediately
    if (isStandaloneMode) {
      setInstallState("already_installed");
      return;
    }

    // 3. Check if getInstalledRelatedApps confirms prior installation (Chromium 84+)
    if (typeof navigator !== "undefined" && "getInstalledRelatedApps" in navigator) {
      (navigator as any)
        .getInstalledRelatedApps()
        .then((apps: any[]) => {
          if (Array.isArray(apps) && apps.length > 0) {
            setInstallState("already_installed");
          }
        })
        .catch(() => {});
    }

    const wasPreviouslyInstalled =
      typeof window !== "undefined" &&
      window.localStorage.getItem("blintzy_installed") === "true";

    // 4. Listen for dynamic display-mode transitions
    const mql = window.matchMedia("(display-mode: standalone)");
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setInstallState("installed");
      }
    };
    mql.addEventListener("change", handleDisplayChange);

    // 5. Handle iOS device detection
    if (isIOSDevice) {
      setInstallState("ios_guide");
      return;
    }

    // 6. Listen for Chromium beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser default mini-infobar on mobile
      e.preventDefault();
      // Stash the event so user can trigger it on demand
      setDeferredPrompt(e);

      // Clear any waiting timer since the prompt is ready
      if (checkingTimerRef.current) {
        clearTimeout(checkingTimerRef.current);
        checkingTimerRef.current = null;
      }

      // Elevate state to ready if currently checking, manual_guide or dismissed
      setInstallState((prev) => {
        if (prev === "checking" || prev === "manual_guide" || prev === "dismissed") {
          return "ready";
        }
        return prev;
      });
    };

    // 7. Listen for appinstalled confirmation
    const handleAppInstalled = () => {
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
      try {
        localStorage.setItem("blintzy_installed", "true");
      } catch (e) {}
      setDeferredPrompt(null);
      setInstallState("installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 8. Non-blocking evaluation window (3.2 seconds):
    // If beforeinstallprompt hasn't fired after this time, don't leave users in an infinite spinner.
    // If user previously completed install, transition to already_installed; otherwise show manual steps.
    checkingTimerRef.current = setTimeout(() => {
      setInstallState((prev) => {
        if (prev === "checking") {
          if (wasPreviouslyInstalled) {
            return "already_installed";
          }
          return "manual_guide";
        }
        return prev;
      });
    }, 3200);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mql.removeEventListener("change", handleDisplayChange);
      if (checkingTimerRef.current) clearTimeout(checkingTimerRef.current);
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    };
  }, []);

  // Trigger native installation prompt when ready
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setInstallState("prompt_active");
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult && choiceResult.outcome === "accepted") {
        try {
          localStorage.setItem("blintzy_installed", "true");
        } catch (e) {}
        setDeferredPrompt(null);
        setInstallState("accepted_pending");

        // The browser's native installation process is now running.
        // We listen for the genuine 'appinstalled' event.
        // If the browser accepts but appinstalled does not fire within 6 seconds,
        // transition to accepted_unconfirmed to inform the user to check their home screen.
        pendingTimerRef.current = setTimeout(() => {
          setInstallState((prev) => {
            if (prev === "accepted_pending") {
              return "accepted_unconfirmed";
            }
            return prev;
          });
        }, 6000);
      } else {
        // User dismissed the native dialog
        setDeferredPrompt(null);
        setInstallState("dismissed");
      }
    } catch (err) {
      console.error("Install prompt error:", err);
      setDeferredPrompt(null);
      setInstallState("manual_guide");
    }
  };

  // Allow users to re-check if they feel their browser is ready
  const handleCheckAgain = () => {
    if (deferredPrompt) {
      setInstallState("ready");
      return;
    }
    setInstallState("checking");
    if (checkingTimerRef.current) clearTimeout(checkingTimerRef.current);
    checkingTimerRef.current = setTimeout(() => {
      setInstallState((prev) => (prev === "checking" ? "manual_guide" : prev));
    }, 3200);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-between p-4 sm:p-6 text-center select-none">
      {/* Top spacing & container */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center pt-4 sm:pt-8 pb-10">
        
        {/* BLINTZY Logo */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl shadow-md flex items-center justify-center mb-6 border border-border/80 p-3 relative overflow-hidden transition-transform duration-300 hover:scale-105">
          <Image
            src="/icon-192x192.png"
            alt="BLINTZY Logo"
            width={112}
            height={112}
            priority
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        {/* Dynamic Headings and Supporting Text */}
        {installState === "accepted_pending" ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 tracking-tight">
              BLINTZY is on its way! 🧡
            </h1>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base font-medium max-w-xs">
              Your campus essentials are almost one tap away.
            </p>
          </>
        ) : installState === "accepted_unconfirmed" ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 tracking-tight">
              One last step 📲
            </h1>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base font-medium max-w-xs">
              Please check your home screen near your apps, and check your notifications to find BLINTZY.
            </p>
          </>
        ) : installState === "installed" || installState === "already_installed" ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 tracking-tight">
              BLINTZY is Installed 🎉
            </h1>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base font-medium max-w-xs">
              Please check your home screen near your apps, and check your notifications.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2 tracking-tight">
              Install BLINTZY
            </h1>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base font-medium max-w-xs">
              Your campus print partner, right from your Home Screen.
            </p>
          </>
        )}

        {/* Dynamic State Cards & Actions */}
        <div className="w-full">
          
          {/* STATE: Installed / Already Installed */}
          {(installState === "installed" || installState === "already_installed") && (
            <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-6 flex flex-col items-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-emerald-950 mb-1">
                {installState === "already_installed" ? "BLINTZY is already installed" : "Installation Confirmed"}
              </h2>
              <p className="text-emerald-900 text-xs sm:text-sm font-semibold mb-4 max-w-xs text-center">
                Please check your home screen near your apps, and check your notifications.
              </p>

              {/* Clear visual guidance */}
              <div className="w-full bg-white/80 border border-emerald-200/80 rounded-xl p-3.5 mb-5 text-left text-xs space-y-2.5">
                <div className="flex items-start gap-2.5 text-emerald-950 font-medium">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Home Screen:</strong> Look for the BLINTZY app icon on your home screen or in your app drawer.</span>
                </div>
                <div className="flex items-start gap-2.5 text-emerald-950 font-medium">
                  <Bell className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Notifications:</strong> Check your notification tray if you recently confirmed the installation.</span>
                </div>
              </div>

              {/* Primary action: Open BLINTZY */}
              <Link
                href={APP_ROUTES.HOME}
                id="open-blintzy-button"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] text-sm uppercase tracking-wide"
              >
                <span>Open BLINTZY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary guidance */}
              <p className="text-emerald-800/80 text-[11px] font-medium mt-3 text-center">
                If it doesn&apos;t open, find BLINTZY directly on your home screen or in your app list.
              </p>

              {/* Link to manual guide if user actually uninstalled */}
              <button
                onClick={() => setInstallState("manual_guide")}
                className="mt-4 text-[11px] font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-950 cursor-pointer"
              >
                Not seeing BLINTZY? View manual install steps
              </button>
            </div>
          )}

          {/* STATE: Accepted Pending (Waiting for genuine appinstalled event) */}
          {installState === "accepted_pending" && (
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-primary mb-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>

              {/* Subtle animated indeterminate progress bar */}
              <div className="w-full bg-orange-100/70 h-1.5 rounded-full overflow-hidden my-3 relative">
                <div className="h-full bg-primary rounded-full animate-indeterminate w-1/2" />
              </div>

              <p className="text-xs sm:text-sm font-semibold text-foreground mt-2 mb-1">
                Adding BLINTZY to your device...
              </p>
              <p className="text-xs text-muted-foreground text-center mb-6 max-w-xs">
                Please check your home screen near your apps or in your app list, and check your notifications.
              </p>

              {/* Primary Guidance & Secondary Action */}
              <div className="w-full space-y-3">
                <div className="w-full bg-secondary/80 text-foreground text-xs font-semibold py-3 px-4 rounded-xl border border-border flex items-center justify-center gap-2">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <span>Check Your Home Screen &amp; Notifications</span>
                </div>

                <Link
                  href={APP_ROUTES.HOME}
                  id="continue-browser-pending"
                  className="w-full bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-bold py-3 px-4 rounded-xl border border-border/60 flex items-center justify-center transition-colors"
                >
                  Continue in Browser (Website)
                </Link>
              </div>
            </div>
          )}

          {/* STATE: Accepted Unconfirmed (Prompt accepted, but browser event didn't confirm) */}
          {installState === "accepted_unconfirmed" && (
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-sm text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-primary mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-foreground mb-1">
                Check Your Home Screen &amp; Notifications
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-xs">
                Installation may take a moment. Please check your home screen near your apps and check your notifications for BLINTZY.
              </p>

              <div className="w-full space-y-3">
                <Link
                  href={APP_ROUTES.HOME}
                  id="continue-browser-unconfirmed"
                  className="w-full bg-primary text-primary-foreground font-bold py-3.5 px-4 rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-sm uppercase tracking-wide transition-all active:scale-[0.98]"
                >
                  <span>Continue in Browser</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-muted-foreground">
                  Opens the web version in your current browser tab.
                </p>
              </div>
            </div>
          )}

          {/* STATE: Ready to Install (beforeinstallprompt captured) */}
          {installState === "ready" && (
            <div className="flex flex-col items-center w-full">
              <button
                id="install-primary-button"
                onClick={handleInstallClick}
                className="w-full bg-primary hover:bg-[#E56000] text-primary-foreground font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2.5 text-base uppercase tracking-wider transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>Install BLINTZY</span>
              </button>
              <p className="text-[11px] font-medium text-muted-foreground mt-3">
                Fast one-tap access • Zero storage hassle • Works offline
              </p>
            </div>
          )}

          {/* STATE: Checking Availability (Initial evaluation window) */}
          {installState === "checking" && (
            <div className="bg-card border border-border/80 rounded-2xl p-5 flex flex-col items-center shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Checking installation readiness...
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Preparing one-tap install for your browser.
              </p>
            </div>
          )}

          {/* STATE: Prompt Active (User is currently seeing browser native prompt) */}
          {installState === "prompt_active" && (
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center shadow-xs">
              <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
              <p className="text-sm font-semibold text-foreground">
                Confirming with your browser...
              </p>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Please respond to the install prompt on your screen.
              </p>
            </div>
          )}

          {/* STATE: Prompt Dismissed */}
          {installState === "dismissed" && (
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-xs text-center">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground mb-3">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                Installation Paused
              </h2>
              <p className="text-xs text-muted-foreground mb-5 max-w-xs">
                You closed the prompt without installing. You can try again or continue using BLINTZY directly in your browser.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  id="check-again-button"
                  onClick={handleCheckAgain}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <Link
                  href={APP_ROUTES.HOME}
                  id="continue-browser-dismissed"
                  className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>Use Browser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* STATE: iOS Safari Guide */}
          {installState === "ios_guide" && (
            <div className="bg-card border border-border rounded-2xl p-6 text-left shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">
                  Add BLINTZY to your Home Screen
                </h2>
              </div>

              {platform.isInApp && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-900 font-medium">
                  <strong>Notice:</strong> You appear to be in an in-app browser. Tap the menu and select <strong>Open in Safari</strong> to enable Add to Home Screen.
                </div>
              )}

              <ol className="space-y-3.5 text-xs sm:text-sm font-medium text-foreground">
                <li className="flex items-start gap-3.5 border-b border-border/70 pb-3">
                  <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Share className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">1. Tap Share</span>
                    <span className="text-muted-foreground text-xs">
                      Tap the <strong>Share</strong> button at the bottom of Safari.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5 border-b border-border/70 pb-3">
                  <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <PlusSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">2. Add to Home Screen</span>
                    <span className="text-muted-foreground text-xs">
                      Scroll down in the share sheet and tap <strong>Add to Home Screen</strong>.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">3. Tap Add</span>
                    <span className="text-muted-foreground text-xs">
                      Confirm by tapping <strong>Add</strong> in the top right corner.
                    </span>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* STATE: Manual Installation Guide (Fallback for unsupported/delayed beforeinstallprompt) */}
          {installState === "manual_guide" && (
            <div className="bg-card border border-border rounded-2xl p-6 text-left shadow-sm">
              
              {/* Prominent notification if already installed */}
              <div className="bg-orange-50/90 border border-orange-200/90 rounded-2xl p-4 mb-5 text-left shadow-xs">
                <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm mb-1.5">
                  <Smartphone className="w-4 h-4 text-primary shrink-0" />
                  <span>Already installed BLINTZY?</span>
                </div>
                <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                  Please check your <strong>home screen near your apps</strong> or in your app drawer, and check your <strong>notifications</strong>.
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <Link
                    href={APP_ROUTES.HOME}
                    id="manual-open-blintzy-btn"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#E56000] transition-all active:scale-95"
                  >
                    <span>Open BLINTZY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setInstallState("already_installed")}
                    className="text-xs font-bold text-primary underline underline-offset-2 hover:text-orange-700 cursor-pointer"
                  >
                    View installed status
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {platform.isDesktop ? (
                  <Monitor className="w-5 h-5 text-primary" />
                ) : (
                  <Smartphone className="w-5 h-5 text-primary" />
                )}
                <h2 className="text-base font-bold text-foreground">
                  Manual Installation Steps
                </h2>
              </div>

              {platform.isInApp ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-900 font-medium">
                  In-app browsers don&apos;t support direct installs. Tap the menu (<strong>⋮</strong> or <strong>⋯</strong>) and choose <strong>Open in Chrome / Safari</strong>.
                </div>
              ) : platform.isDesktop ? (
                <div className="space-y-3 text-xs sm:text-sm text-foreground">
                  <p className="text-muted-foreground">
                    To install BLINTZY on desktop Chrome or Edge:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs font-medium">
                    <li>Look for the <strong>Install icon</strong> in your browser&apos;s address bar.</li>
                    <li>Or click the <strong>three dots (⋮)</strong> menu in the top right.</li>
                    <li>Select <strong>Install BLINTZY</strong> and confirm.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3 text-xs sm:text-sm text-foreground">
                  <p className="text-muted-foreground">
                    To install BLINTZY on your Android device:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs font-medium">
                    <li>Tap the <strong>three dots (⋮)</strong> in your browser&apos;s top-right corner.</li>
                    <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                    <li>Confirm to place BLINTZY on your device.</li>
                  </ol>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <button
                  id="check-again-manual-button"
                  onClick={handleCheckAgain}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Check availability again</span>
                </button>

                <Link
                  href={APP_ROUTES.HOME}
                  id="continue-browser-manual-link"
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Continue in browser →
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Student-Focused Benefits Section */}
        <section
          aria-labelledby="student-benefits-title"
          className="mt-8 w-full pt-8 border-t border-border/80"
        >
          <div className="text-center mb-5">
            <h2 id="student-benefits-title" className="text-[11px] uppercase tracking-wider font-extrabold text-muted-foreground">
              Built for campus life
            </h2>
            <p className="text-sm font-bold text-foreground mt-0.5">
              One campus. A smarter way to get things done.
            </p>
          </div>

          {/* 3 Concise Benefit Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full">
            <div className="bg-card border border-border/70 rounded-2xl p-3 flex flex-col items-center text-center shadow-xs">
              <span className="text-xl mb-1.5" role="img" aria-label="Manuals">
                📄
              </span>
              <span className="text-xs font-bold text-foreground leading-tight">
                Manuals &amp; Hall Tickets
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 leading-tight">
                Instant syllabus &amp; admit cards
              </span>
            </div>

            <div className="bg-card border border-border/70 rounded-2xl p-3 flex flex-col items-center text-center shadow-xs">
              <span className="text-xl mb-1.5" role="img" aria-label="Printing">
                ⚡
              </span>
              <span className="text-xs font-bold text-foreground leading-tight">
                Simpler Campus Printing
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 leading-tight">
                Order ahead &amp; collect
              </span>
            </div>

            <div className="bg-card border border-border/70 rounded-2xl p-3 flex flex-col items-center text-center shadow-xs">
              <span className="text-xl mb-1.5" role="img" aria-label="RCE">
                🧡
              </span>
              <span className="text-xs font-bold text-foreground leading-tight">
                Built for RCE Students
              </span>
              <span className="text-[10px] text-muted-foreground mt-1 leading-tight">
                Tailored for your campus
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4 font-medium">
            Your BLINTZY campus journey starts here.
          </p>

          {/* Subtle Ambassador Link (Accurate, Restrained, No Unrealistic Promises) */}
          <div className="mt-5 pt-4 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground">
              Interested in campus leadership?{" "}
              <Link
                href={APP_ROUTES.AMBASSADOR}
                id="ambassador-link"
                className="text-primary font-bold hover:underline underline-offset-2 inline-flex items-center gap-1"
              >
                <span>Campus Ambassador Programme</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </p>
            <p className="text-[11px] text-muted-foreground/70 mt-1">
              Top contenders from the verified campus leaderboard are selected as ambassadors.
            </p>
          </div>
        </section>

        {/* Global Fallback Route: Continue to Browser Version */}
        {installState !== "installed" && installState !== "already_installed" && (
          <div className="mt-8">
            <Link
              href={APP_ROUTES.HOME}
              id="continue-browser-footer"
              className="text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground underline decoration-muted-foreground/30 underline-offset-4 transition-colors"
            >
              Continue to browser version
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
