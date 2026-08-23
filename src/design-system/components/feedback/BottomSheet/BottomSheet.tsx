"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/utils/cn";
import { motion } from "framer-motion";
import { motionPresets } from "@/design-system/animations";

/**
 * Mobile-first slide-up panel.
 */
export interface BottomSheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  ({ className, isLoading, isDisabled, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("min-h-[44px] flex items-center justify-center rounded-md", className)}
        {...motionPresets.fade}
        {...props}
      >
        {isLoading ? "Loading..." : props.children}
      </motion.div>
    );
  }
);
BottomSheet.displayName = "BottomSheet";

