import axios from 'axios';

const API_URL = 'https://message-tailor-api-production.up.railway.app/payment';

export const verifyPayment = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL}/verify-payment`, {
      sessionId
    });
    return response.data.success;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
};