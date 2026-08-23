"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/utils/cn";
import { motion } from "framer-motion";
import { motionPresets } from "@/design-system/animations";

/**
 * Base button component with variants.
 */
export interface ButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"> {
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ className, isLoading, isDisabled, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("min-h-[52px] h-[52px] flex items-center justify-center rounded-[18px]", className)}
        {...motionPresets.fade}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.12 }}
        {...props}
      >
        {isLoading ? "Loading..." : props.children}
      </motion.div>
    );
  }
);
Button.displayName = "Button";

