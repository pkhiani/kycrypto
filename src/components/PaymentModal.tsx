import React, { useState } from 'react';
import { X, Loader, CheckCircle } from 'lucide-react';
import { useStripePayment } from '../hooks/useStripePayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const {
    promoCode,
    isValidating,
    error,
    isPromoValid,
    handlePayment,
    handlePromoCodeChange,
    validatePromoCode,
  } = useStripePayment({
    baseUrl: 'https://buy.stripe.com/00g17X1Ya98rcYEbII',
    onPaymentSuccess: onClose,
  });

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await validatePromoCode(promoCode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute right-4 top-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-4">
                Unlock Detailed Analysis
              </h3>
              
              <div className="mt-4 space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
                  <ul className="list-disc list-inside text-blue-800 space-y-2">
                    <li>Detailed market analysis for each cryptocurrency</li>
                    <li>Historical performance data</li>
                    <li>Risk assessment reports</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">One-time payment</span>
                    <span className="text-2xl font-bold text-gray-900">$20</span>
                  </div>
                  <p className="text-sm text-gray-500">
                  </p>
                </div>

                <form onSubmit={handlePromoSubmit} className="space-y-2">
                  <label htmlFor="promo" className="block text-sm font-medium text-gray-700">
                    Have a promo code?
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        id="promo"
                        value={promoCode}
                        onChange={(e) => handlePromoCodeChange(e.target.value)}
                        className={`block w-full rounded-l-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                          isPromoValid
                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                        placeholder="Enter promo code"
                      />
                      {isPromoValid && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isValidating || !promoCode}
                      className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidating ? (
                        <Loader className="animate-spin h-4 w-4" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  )}
                  {isPromoValid && (
                    <p className="text-sm text-green-600 mt-1">
                      Promo code applied successfully!
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handlePayment}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            >
              Continue to Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};