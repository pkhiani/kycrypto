import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Crypto Portfolios, Tailored to You
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get personalized cryptocurrency portfolio recommendations based on your goals and risk tolerance
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Get started
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};