'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { PasswordInput } from '@/design-system/components/inputs/PasswordInput/PasswordInput';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase client automatically processes the recovery hash in the URL.
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // We delay the error slightly so if the hash is still processing we don't flash it immediately
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: checkSession } }) => {
            if (!checkSession) {
              setError('This reset link is invalid or has expired. Please request a new link.');
            }
          });
        }, 1000);
      }
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) {
        throw updateError;
      }
      
      setSuccess(true);
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white p-8 rounded-3xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black mb-2 text-primary">Set New Password</h1>
          <p className="text-muted-foreground text-sm">Please enter your new password below.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-500/10 text-green-500 rounded-lg text-sm font-medium">
              Your password has been updated successfully. You can now log in.
            </div>
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <fieldset disabled={isLoading} className="space-y-4">
              <div>
                <PasswordInput 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="floating"
                  label="New Password"
                  showStrength
                />
              </div>
              <div>
                <PasswordInput 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="floating"
                  label="Confirm New Password"
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading || !!error}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-glow mt-4 disabled:opacity-50 transition-all hover:bg-primary/90"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </fieldset>
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
