import { useState, useCallback, useEffect } from 'react';
import { createCheckoutSession, verifyPayment } from '../services/paymentService';

interface UseStripePaymentProps {
  priceId: string;
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
}

export const useStripePayment = ({ priceId, onPaymentSuccess, onPaymentFailure }: UseStripePaymentProps) => {
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment');
      
      if (paymentStatus) {
        try {
          const isVerified = await verifyPayment(paymentStatus);
          if (isVerified) {
            window.history.replaceState({}, '', window.location.pathname);
            onPaymentSuccess();
          } else {
            onPaymentFailure();
          }
        } catch (error) {
          onPaymentFailure();
        }
      }
    };

    checkPaymentStatus();
  }, [onPaymentSuccess, onPaymentFailure]);

  const handlePayment = useCallback(async () => {
    try {
      const checkoutUrl = await createCheckoutSession(priceId);
      window.open(checkoutUrl, '_blank');
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      onPaymentFailure();
    }
  }, [priceId, onPaymentFailure]);

  return {
    handlePayment
  };
};