// src/features/profile/hooks/useSecurity.ts
import { useState, useEffect } from 'react';
import { SecuritySettings } from '../types';
import { securityApi } from '../api/securityApi';
import { useRouter } from 'next/navigation';

export const useSecurity = () => {
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await securityApi.getSecuritySettings();
        if (mounted) setSecurity(res);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const logoutDevice = async (id: string) => {
    // Optimistic
    setSecurity(prev => prev ? { ...prev, connectedDevices: prev.connectedDevices.filter(d => d.id !== id) } : null);
    try {
      await securityApi.logoutDevice(id);
    } catch {
      // re-fetch on error
    }
  };

  const logoutAll = async () => {
    await securityApi.logoutAllDevices();
    router.replace('/app/login');
  };

  return { security, isLoading, logoutDevice, logoutAll };
};
