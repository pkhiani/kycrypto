import { useState, useCallback, useEffect } from 'react';

interface UseStripePaymentProps {
  baseUrl: string;
  onPaymentSuccess: () => void;
}

export const useStripePayment = ({ baseUrl, onPaymentSuccess }: UseStripePaymentProps) => {
  const [paymentWindowRef, setPaymentWindowRef] = useState<Window | null>(null);

  // Poll for payment success when payment window is open
  useEffect(() => {
    if (!paymentWindowRef) return;

    const pollInterval = setInterval(() => {
      if (paymentWindowRef.closed) {
        const paymentSuccess = localStorage.getItem('pending_payment_success');
        if (paymentSuccess === 'true') {
          localStorage.removeItem('pending_payment_success');
          localStorage.setItem('kycrypto_premium', 'true');
          onPaymentSuccess();
        }
        clearInterval(pollInterval);
        setPaymentWindowRef(null);
      }
    }, 500);

    return () => clearInterval(pollInterval);
  }, [paymentWindowRef, onPaymentSuccess]);

  const handlePayment = useCallback(() => {
    // Set up payment tracking
    localStorage.setItem('payment_pending', 'true');
    localStorage.removeItem('pending_payment_success');

    // Create success URL with timestamp to prevent caching
    const timestamp = Date.now();
    const successPath = `${window.location.pathname}?payment=success&t=${timestamp}`;
    const returnUrl = `${window.location.origin}${successPath}`;
    
    const checkoutUrl = `${baseUrl}?redirect_url=${encodeURIComponent(returnUrl)}`;
    
    // Open payment window as popup
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
  }, [baseUrl]);

  return {
    handlePayment,
  };
};