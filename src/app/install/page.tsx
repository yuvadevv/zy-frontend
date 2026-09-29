"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Share, PlusSquare, Smartphone, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes("Mac") && "ontouchend" in document);

    if (isIOSDevice) {
      setIsIOS(true);
      return;
    }

    // Listen for beforeinstallprompt (Android / Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log("Install prompt captured");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If it's not iOS and no beforeinstallprompt fires immediately, 
    // we just wait. We don't mark as unsupported right away because it takes time to fire.

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Logo */}
        <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 border border-border overflow-hidden">
          <Image 
            src="/icon-192x192.png" 
            alt="BLINTZY Logo" 
            width={128} 
            height={128} 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title & Description */}
        <h1 className="text-3xl font-black text-foreground mb-3 tracking-tight">
          Install BLINTZY
        </h1>
        <p className="text-muted-foreground mb-10 text-base font-medium max-w-[280px]">
          Your campus print partner, right from your Home Screen.
        </p>

        {/* Status / Actions */}
        <div className="w-full">
          {isInstalled ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-xl font-bold text-green-900 mb-2">BLINTZY is already installed</h2>
              <p className="text-green-800 text-sm font-medium mb-6">Open BLINTZY directly from your device Home Screen.</p>
              <Link 
                href="/app/home" 
                className="w-full bg-green-600 text-white font-black py-4 rounded-xl flex items-center justify-center shadow-md uppercase text-sm tracking-wide"
              >
                Go to Home
              </Link>
            </div>
          ) : isIOS ? (
            <div className="bg-card border border-border rounded-2xl p-6 text-left shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-4 text-center">Add BLINTZY to your Home Screen</h2>
              <ol className="space-y-4 text-sm font-medium text-foreground">
                <li className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                    <Share className="w-5 h-5 text-primary" />
                  </div>
                  <span>Tap the <strong>Share</strong> button at the bottom of Safari.</span>
                </li>
                <li className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                    <PlusSquare className="w-5 h-5 text-primary" />
                  </div>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <span>Confirm by tapping <strong>Add</strong> in the top right.</span>
                </li>
              </ol>
            </div>
          ) : deferredPrompt ? (
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-muted-foreground mb-6">
                Install BLINTZY for quick access to campus printing, Xerox, manuals, hall tickets and more.
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full bg-primary text-primary-foreground font-black py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-base uppercase tracking-wider transition-transform active:scale-95"
              >
                <Download className="w-5 h-5" /> Install BLINTZY
              </button>
            </div>
          ) : (
             <div className="flex flex-col items-center bg-card border border-border rounded-2xl p-6">
               <Smartphone className="w-10 h-10 text-muted-foreground mb-4" />
               <p className="text-sm font-medium text-muted-foreground text-center">
                 To install BLINTZY, open this page in a supported browser like Chrome, Edge, or Safari on iOS.
               </p>
             </div>
          )}
        </div>

        <div className="mt-12">
          <Link href="/app/home" className="text-sm font-bold text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4 hover:text-foreground">
            Continue to browser version
          </Link>
        </div>

      </div>
    </main>
  );
}
