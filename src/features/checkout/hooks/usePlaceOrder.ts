// src/features/checkout/hooks/usePlaceOrder.ts

import { useState, useRef } from 'react';
import { PlaceOrderRequest, CheckoutResponse, PaymentStatus } from '../types';
import { useCheckoutAnalytics } from './useCheckoutAnalytics';

import { Order } from '@/features/orders/types';
import { useStudent } from '@/features/student/providers/StudentProvider';
import { workerClient } from '@/lib/api/workerClient';

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const usePlaceOrder = () => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { profile } = useStudent();

  // Idempotency: Prevent duplicate submissions
  const isRequestInFlight = useRef(false);
  const { trackOrderPlaced, trackCheckoutFailed } = useCheckoutAnalytics();

  const placeOrder = async (request: PlaceOrderRequest, totalValue: number): Promise<CheckoutResponse> => {
    if (isRequestInFlight.current) {
      return { success: false, errorMessage: 'Order is already being processed.' };
    }
    
    isRequestInFlight.current = true;
    setIsPlacingOrder(true);
    setError(null);

    try {
      const itemsPayload = request.cartItems.map(item => ({
        serviceType: item.serviceType === 'xerox' ? 'custom' : item.serviceType,
        manualId: item.serviceType === 'manual' ? (item.referenceId || item.id) : null,
        documentId: (item.serviceType === 'hall_ticket' || item.serviceType === 'custom' || item.serviceType === 'xerox') ? (item.referenceId || item.id) : null,
        printOptions: {
          ...item.printOptions,
          copies: item.quantity
        }
      }));

      // 1. Create Order
      const apiResponse = await workerClient.createOrder(
        itemsPayload, 
        request.checkoutState.deliveryDetails, 
        request.checkoutState.couponCode
      );
      const orderId = apiResponse.orderId;

      // 2. Initialize Payment
      const paymentRes = await workerClient.createPayment(orderId);

      // 3. Handle Development Mock OR Real Razorpay
      if (paymentRes.keyId === 'mock_key' && process.env.NODE_ENV === 'development') {
        // Development Mock
        await new Promise(resolve => setTimeout(resolve, 1500));
        await workerClient.verifyPayment(paymentRes.providerOrderId, 'mock_txn_' + Date.now());
        
        const response: CheckoutResponse = {
          success: true,
          orderId: orderId,
          trackingId: orderId,
          estimatedDelivery: request.checkoutState.deliveryDetails?.estimatedTime,
          paymentStatus: PaymentStatus.PAID,
        };

        trackOrderPlaced(response.orderId!, apiResponse.grandTotal);
        return response;
      } else {
        // Real Razorpay Integration
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Failed to load payment gateway. Please check your connection.');
        }
        
        if (!paymentRes.keyId) {
          throw new Error('Payment gateway is not configured yet.');
        }

        return new Promise<CheckoutResponse>((resolve, reject) => {
          const options = {
            key: paymentRes.keyId,
            amount: paymentRes.amount * 100, // paise
            currency: paymentRes.currency,
            name: 'BLINTZY',
            description: 'Printing Services',
            order_id: paymentRes.providerOrderId,
            handler: async function (response: any) {
              try {
                // Verify signature on backend
                await workerClient.verifyPayment(
                  paymentRes.providerOrderId,
                  response.razorpay_payment_id,
                  response.razorpay_signature
                );
                
                const successRes: CheckoutResponse = {
                  success: true,
                  orderId: orderId,
                  trackingId: orderId,
                  estimatedDelivery: request.checkoutState.deliveryDetails?.estimatedTime,
                  paymentStatus: PaymentStatus.PAID,
                };

                trackOrderPlaced(successRes.orderId!, apiResponse.grandTotal);
                resolve(successRes);
              } catch (verifyErr: any) {
                const errMsg = 'Payment verification failed.';
                trackCheckoutFailed(errMsg);
                resolve({ success: false, errorMessage: errMsg });
              }
            },
            prefill: {
              name: profile?.full_name || 'Student',
              contact: profile?.phone_number || '',
            },
            theme: {
              color: '#3b82f6'
            },
            modal: {
              ondismiss: function() {
                const errMsg = 'Payment was cancelled.';
                trackCheckoutFailed(errMsg);
                resolve({ success: false, errorMessage: errMsg });
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
            const errMsg = response.error.description || 'Payment failed.';
            trackCheckoutFailed(errMsg);
            resolve({ success: false, errorMessage: errMsg });
          });
          rzp.open();
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Network error while placing order. Please try again.';
      setError(errorMessage);
      trackCheckoutFailed(errorMessage);
      return { success: false, errorMessage };
    } finally {
      setIsPlacingOrder(false);
      isRequestInFlight.current = false;
    }
  };

  return {
    placeOrder,
    isPlacingOrder,
    error
  };
};
