'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordFormData } from '@/features/auth/validators/authValidators';
import { authService } from '@/features/auth/services/authService';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { PasswordInput } from '@/design-system/components/inputs/PasswordInput/PasswordInput';
import { Loader2 } from 'lucide-react';
import { SessionManager } from '@/utils/SessionManager';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await authService.updatePassword(data.password);
      setSuccess(true);
      // Wait a moment so the user reads the success message
      setTimeout(() => {
        window.location.href = '/app/home';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white p-8 rounded-3xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Update Password
          </h1>
          <p className="text-gray-500 text-sm">Please enter your new password below</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-6 bg-green-50 text-green-700 rounded-xl text-center border border-green-100 mb-4">
            <h3 className="font-bold mb-2">Password Updated!</h3>
            <p className="text-sm">Your password has been successfully changed. Redirecting to your account...</p>
          </div>
        ) : (
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
                  label="Confirm New Password"
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-orange-500 text-white rounded-xl font-bold shadow-sm disabled:opacity-70 transition-all hover:bg-orange-600 active:scale-[0.98] flex items-center justify-center mt-6"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
              </button>
            </fieldset>
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
