import axios from 'axios';

const API_URL = 'https://message-tailor-api-production.up.railway.app/payment';

export const createCheckoutSession = async (priceId: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/create-checkout-session`, {
      priceId,
      successUrl: `${window.location.origin}${window.location.pathname}?payment=success`,
      cancelUrl: `${window.location.origin}${window.location.pathname}?payment=cancelled`
    });
    
    return response.data.url;
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
};

export const verifyPayment = async (payment: string): Promise<boolean> => {
  if (payment === 'success') {
    const expirationTime = Date.now() + (12 * 60 * 60 * 1000); // 12 hours from now
    localStorage.setItem('kycrypto_premium', 'true');
    localStorage.setItem('kycrypto_premium_expiration', expirationTime.toString());
    
    return true;
  }
  return false;
};