'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/features/auth/services/authService';
import { vendorClient } from '@/lib/api/vendorClient';
import { PasswordInput } from '@/design-system/components/inputs/PasswordInput/PasswordInput';
import { Loader2, KeyRound, AlertCircle } from 'lucide-react';

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function VendorChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormData) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      // Update password via Supabase Client
      await authService.updatePassword(data.password);
      
      // Update vendor record in D1 to set password_change_required = false
      // We need a new endpoint or we can let the backend auth hook handle this?
      // Since we don't have a backend auth hook, we can hit a new endpoint in vendorClient
      // or we can just let admin do it? Wait, vendor can update their own status.
      // I'll create a simple patch to /api/vendor/profile to update password_change_required
      
      await fetch('/api/vendor/profile/password-changed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await authService.getCurrentSession())?.session?.access_token}`
        }
      });
      
      router.replace('/vendor');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-blue-100"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 text-[#FF6B00] p-4 rounded-full shadow-sm border border-orange-200">
            <KeyRound className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Change Password
          </h1>
          <p className="text-gray-500 font-medium text-sm">Please choose a new secure password to continue.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center border border-red-100 font-medium">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={isLoading} className="space-y-4">
            <div>
              <PasswordInput 
                {...register("password")}
                variant="floating"
                label="New Password"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.password.message}</p>}
            </div>
            <div>
              <PasswordInput 
                {...register("confirmPassword")}
                variant="floating"
                label="Confirm Password"
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#FF6B00] text-white rounded-xl font-bold shadow-sm disabled:opacity-70 transition-all hover:bg-[#e66000] active:scale-[0.98] flex items-center justify-center mt-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
            </button>
          </fieldset>
        </form>
      </motion.div>
    </div>
  );
}
