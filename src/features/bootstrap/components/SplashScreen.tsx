"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { motionPresets } from "@/design-system/animations";
export function SplashScreen() {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background" {...motionPresets.fade}>
      <motion.div className="flex flex-col items-center" {...motionPresets.slideUp}>
        <div className="text-primary font-bold text-display tracking-tight">BLINTZY</div>
        <p className="text-muted-foreground mt-4 text-label">Campus Printing. Delivered Smarter.</p>
      </motion.div>
    </motion.div>
  );
}