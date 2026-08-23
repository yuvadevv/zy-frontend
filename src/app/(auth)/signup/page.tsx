'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupSchema, SignupFormData } from '@/features/auth/validators/authValidators';
import { authService } from '@/features/auth/services/authService';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { TextInput } from '@/design-system/components/inputs/TextInput/TextInput';
import { PasswordInput } from '@/design-system/components/inputs/PasswordInput/PasswordInput';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await authService.signUpWithEmail(data);
      router.push('/app/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    if (isLoading) return;
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google signup failed');
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
            Create your student account
          </h1>
          <p className="text-gray-500 text-sm">Join BLINTZY to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <button 
          onClick={onGoogleLogin}
          disabled={isLoading}
          className="w-full border border-gray-200 bg-white text-gray-700 py-3 rounded-xl font-bold mb-6 flex items-center justify-center gap-2 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </button>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest font-semibold">Or Email</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={isLoading} className="space-y-4">
            <div>
              <TextInput 
                {...register("email")}
                type="email"
                variant="floating"
                label="Email address"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email.message}</p>}
            </div>
            <div>
              <PasswordInput 
                {...register("password")}
                variant="floating"
                label="Password"
                showStrength
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
              className="w-full h-12 bg-orange-500 text-white rounded-xl font-bold shadow-sm mt-4 disabled:opacity-70 transition-all hover:bg-orange-600 active:scale-[0.98] flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </fieldset>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
