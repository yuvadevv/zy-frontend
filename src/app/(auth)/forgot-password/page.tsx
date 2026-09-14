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
  const [cooldown, setCooldown] = useState(0);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (cooldown > 0) return;
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await authService.resetPassword(data.email);
      setSuccessMsg("If an account exists with this email address, a password-reset link has been sent. Please check your inbox and spam folder.");
      setCooldown(60);
    } catch (err: any) {
      if (err.message?.includes('60 seconds') || err.message?.includes('Too many requests')) {
        setError('Please wait 60 seconds before requesting another reset link.');
        setCooldown(60);
      } else {
        setError(err.message || 'Failed to send reset link');
      }
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
            disabled={isLoading || cooldown > 0}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow mt-2 disabled:opacity-50 transition-all hover:bg-primary/90"
          >
            {isLoading ? "Sending..." : cooldown > 0 ? `Resend Link (${cooldown}s)` : "Send Reset Link"}
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
