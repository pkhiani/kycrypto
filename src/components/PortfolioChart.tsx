import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PortfolioAllocation } from '../types';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import { WalletDropdown } from './WalletDropdown';
import { PaymentModal } from './PaymentModal';

interface PortfolioChartProps {
  data: PortfolioAllocation[];
  onBack: () => void;
  onViewDetails: () => void;
  hasPremium: boolean;
}

const wallets = [
  {
    name: 'Coinbase Wallet',
    icon: '/assets/wallets/coinbase.svg',
    url: 'https://coinbase.com/join/8ZWWRZQ?src=referral-link'
  },
  {
    name: 'Crypto.com',
    icon: '/assets/wallets/crypto-com.svg',
    url: 'https://crypto.com/app/aph7q6ct7b'
  }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <img 
            src={`/assets/crypto/${data.name.toLowerCase()}.svg`}
            alt={data.name}
            className="w-6 h-6"
          />
          <h4 className="font-bold text-gray-900">{data.name}</h4>
        </div>
        <p className="text-sm text-gray-600 mt-1">Allocation: {data.value}%</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm">Market Cap: {data.marketCap}</p>
          <p className="text-sm">24h Volume: {data.volume}</p>
          <p className="text-sm">24h Price Change: {Math.round(data.volatility * 100) / 100}% </p>
        </div>
      </div>
    );
  }
  return null;
};

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  data, 
  onBack, 
  onViewDetails,
  hasPremium
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const totalInvestment = data.reduce((sum, asset) => sum + (asset.amount || 0), 0);

  const portfolioType = React.useMemo(() => {
    const bitcoinAllocation = data.find(asset => asset.name === 'Bitcoin')?.value || 0;
    if (bitcoinAllocation > 50) return 'Conservative';
    if (bitcoinAllocation >= 40) return 'Balanced';
    return 'Aggressive';
  }, [data]);

  const handleAnalysisClick = () => {
    if (hasPremium) {
      onViewDetails();
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    onViewDetails();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPortfolioTypeColor = (type: string) => {
    switch (type) {
      case 'Conservative':
        return 'bg-blue-100 text-blue-800';
      case 'Aggressive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Your AI-Recommended Portfolio</h2>
        </div>

        <div className="mb-8 text-center">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getPortfolioTypeColor(portfolioType)}`}>
            {portfolioType} Portfolio
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={140}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Breakdown</h3>
              <div className="space-y-3">
                {data.map((asset) => (
                  <div key={asset.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={`/assets/crypto/${asset.name.toLowerCase()}.svg`}
                        alt={asset.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <span className="font-medium block">{asset.name}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency((totalInvestment * asset.value) / 100)}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">{asset.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalysisClick}
              className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg transition-colors ${
                hasPremium 
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } text-white focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {hasPremium ? (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  View Detailed Analysis
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock Detailed Analysis
                </>
              )}
            </button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Portfolio Insights</h4>
              <p className="text-blue-800">
                This AI-generated portfolio is tailored to your risk profile and investment goals.
                The allocation balances potential returns with your specified risk tolerance.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <h2 className="ml-2 text-xl font-bold text-gray-900">Get Started with a Wallet</h2>
          </div>
          
          <WalletDropdown wallets={wallets} />

          <p className="mt-4 text-sm text-gray-600">
            Choose a wallet to get started with cryptocurrency. Each option offers secure storage and easy access to digital assets.
          </p>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};