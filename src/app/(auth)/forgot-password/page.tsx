'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/features/auth/validators/authValidators';
import { authService } from '@/features/auth/services/authService';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(data.email);
      setSuccessMsg("If an account exists, a password reset link has been sent to your email.");
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white p-8 rounded-3xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black mb-2 text-primary">Reset Password</h1>
          <p className="text-muted-foreground text-sm">Enter your email to receive a reset link</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-4 p-4 bg-green-500/10 text-green-500 rounded-lg text-sm text-center font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input 
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="w-full p-3 bg-secondary/50 rounded-xl border border-border focus:border-primary outline-none transition-all"
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow mt-2 disabled:opacity-50 transition-all hover:bg-primary/90"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Remember your password?{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
