"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckoutState, DeliveryDetails } from '../types';

interface CheckoutContextType {
  state: CheckoutState;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  setPaymentMethodId: (id: string) => void;
  setCouponCode: (code: string | null) => void;
  setStudentNotes: (notes: string) => void;
  setTermsAccepted: (accepted: boolean) => void;
  isValid: boolean;
  clearSession: () => void;
}

const defaultState: CheckoutState = {
  deliveryDetails: null,
  paymentMethodId: null,
  couponCode: null,
  studentNotes: '',
  termsAccepted: false
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const STORAGE_KEY = 'blintzy_checkout_session';

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<CheckoutState>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore session from localStorage on mount (Offline Support)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to restore checkout session');
    }
    setIsInitialized(true);
  }, []);

  // Persist session to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isInitialized]);

  const updateState = (updates: Partial<CheckoutState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const setDeliveryDetails = (details: DeliveryDetails) => updateState({ deliveryDetails: details });
  const setPaymentMethodId = (id: string) => updateState({ paymentMethodId: id });
  const setCouponCode = (code: string | null) => updateState({ couponCode: code });
  const setStudentNotes = (notes: string) => updateState({ studentNotes: notes });
  const setTermsAccepted = (accepted: boolean) => updateState({ termsAccepted: accepted });
  
  const clearSession = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Validation: Cart check will happen in page, here we validate checkout selections
  const isValid = Boolean(
    state.deliveryDetails && 
    state.paymentMethodId && 
    state.termsAccepted
  );

  return (
    <CheckoutContext.Provider value={{
      state,
      setDeliveryDetails,
      setPaymentMethodId,
      setCouponCode,
      setStudentNotes,
      setTermsAccepted,
      isValid,
      clearSession
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
