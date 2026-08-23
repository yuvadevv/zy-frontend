"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/utils/cn";

const textInputVariants = cva(
  "w-full transition-all outline-none",
  {
    variants: {
      variant: {
        default: "p-3 bg-secondary/50 rounded-xl border border-border focus:border-primary",
        floating: "block px-4 pb-2.5 pt-6 w-full text-sm text-gray-900 bg-white rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-orange-500 peer"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof textInputVariants> {
  label?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, variant, label, id, placeholder, ...props }, ref) => {
    const inputId = id || React.useId();

    if (variant === "floating" && label) {
      return (
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={cn(textInputVariants({ variant, className }))}
            placeholder=" "
            {...props}
          />
          <label
            htmlFor={inputId}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange-500 cursor-text"
          >
            {label}
          </label>
        </div>
      );
    }

    return (
      <input
        ref={ref}
        id={inputId}
        placeholder={placeholder}
        className={cn(textInputVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
TextInput.displayName = "TextInput";

