"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/design-system/utils/cn";
import { Eye, EyeOff } from "lucide-react";

const passwordInputVariants = cva(
  "w-full transition-all outline-none",
  {
    variants: {
      variant: {
        default: "p-3 bg-secondary/50 rounded-xl border border-border focus:border-primary pr-10",
        floating: "block px-4 pb-2.5 pt-6 w-full text-sm text-gray-900 bg-white rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-orange-500 peer pr-10"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof passwordInputVariants> {
  label?: string;
  showStrength?: boolean;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "bg-gray-200" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 3) return { score, label: "Weak", color: "bg-red-500" };
  if (score < 5) return { score, label: "Medium", color: "bg-yellow-500" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, variant, label, id, placeholder, showStrength = false, onChange, ...props }, ref) => {
    const inputId = id || React.useId();
    const [showPassword, setShowPassword] = React.useState(false);
    const [password, setPassword] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      onChange?.(e);
    };

    const strength = getPasswordStrength(password);

    const toggleIcon = (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-md"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    );

    const renderInput = () => {
      if (variant === "floating" && label) {
        return (
          <div className="relative">
            <input
              id={inputId}
              ref={ref}
              type={showPassword ? "text" : "password"}
              className={cn(passwordInputVariants({ variant, className }))}
              placeholder=" "
              onChange={handleChange}
              {...props}
            />
            <label
              htmlFor={inputId}
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange-500 cursor-text"
            >
              {label}
            </label>
            {toggleIcon}
          </div>
        );
      }

      return (
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={cn(passwordInputVariants({ variant, className }))}
            onChange={handleChange}
            {...props}
          />
          {toggleIcon}
        </div>
      );
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {renderInput()}
        {showStrength && password.length > 0 && (
          <div className="flex items-center gap-2 px-1 transition-all">
            <div className="flex-1 flex gap-1 h-1.5">
              <div className={cn("flex-1 rounded-full transition-colors", strength.score >= 1 ? strength.color : "bg-gray-200")} />
              <div className={cn("flex-1 rounded-full transition-colors", strength.score >= 3 ? strength.color : "bg-gray-200")} />
              <div className={cn("flex-1 rounded-full transition-colors", strength.score >= 5 ? strength.color : "bg-gray-200")} />
            </div>
            <span className={cn("text-xs font-semibold", 
              strength.label === "Weak" ? "text-red-500" :
              strength.label === "Medium" ? "text-yellow-600" :
              "text-green-600"
            )}>
              {strength.label}
            </span>
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

