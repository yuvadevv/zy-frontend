"use client";
import * as React from "react";
import { mapAuthError } from "../utils/errorMapper";
export function AuthErrorBottomSheet({ code, onClose }: { code: string | null; onClose: () => void }) {
  if (!code) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[400] bg-background border-t border-border p-6 rounded-t-2xl shadow-premium animate-in slide-in-from-bottom-full">
      <h3 className="text-title font-bold text-destructive mb-2">Error</h3>
      <p className="text-muted-foreground mb-6">{mapAuthError(code)}</p>
      <button onClick={onClose} className="w-full bg-secondary text-secondary-foreground py-3 rounded-md font-bold">Dismiss</button>
    </div>
  );
}