import { useState, useCallback, useEffect } from 'react';
import { createCheckoutSession, verifyPayment } from '../services/paymentService';

interface UseStripePaymentProps {
  priceId: string;
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
}

export const useStripePayment = ({ priceId, onPaymentSuccess, onPaymentFailure }: UseStripePaymentProps) => {
  const [paymentWindowRef, setPaymentWindowRef] = useState<Window | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment');
      
      if (paymentStatus) {
        try {
          const isVerified = await verifyPayment(paymentStatus);
          if (isVerified) {
            if (paymentWindowRef && !paymentWindowRef.closed) {
              paymentWindowRef.close();
            }
            setPaymentWindowRef(null);
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
  }, [onPaymentSuccess, onPaymentFailure, paymentWindowRef]);

  useEffect(() => {
    if (!paymentWindowRef) return;

    const pollInterval = setInterval(() => {
      if (paymentWindowRef.closed) {
        clearInterval(pollInterval);
        setPaymentWindowRef(null);
        
        const params = new URLSearchParams(window.location.search);
        if (params.get('payment') === 'success') {
          onPaymentSuccess();
        }
      }
    }, 500);

    return () => clearInterval(pollInterval);
  }, [paymentWindowRef, onPaymentSuccess]);

  const handlePayment = useCallback(async () => {
    try {
      const checkoutUrl = await createCheckoutSession(priceId);
      
      const width = 480;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const paymentWindow = window.open(
        checkoutUrl,
        'Stripe Checkout',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (paymentWindow) {
        setPaymentWindowRef(paymentWindow);
        paymentWindow.focus();
      }
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      onPaymentFailure();
    }
  }, [priceId, onPaymentFailure]);

  return {
    handlePayment
  };
};