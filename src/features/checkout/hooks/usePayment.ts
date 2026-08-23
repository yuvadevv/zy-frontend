// src/features/checkout/hooks/usePayment.ts

import { useState, useEffect } from 'react';
import { PaymentMethod } from '../types';
import { MOCK_PAYMENT_METHODS } from '../services/mockCheckout';

export const usePayment = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMethods = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Mock backend API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setMethods(MOCK_PAYMENT_METHODS);
      } catch (err) {
        setError('Failed to load payment methods');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMethods();
  }, []);

  return {
    methods,
    isLoading,
    error
  };
};
