import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PortfolioAllocation } from '../types';
import { ArrowLeft, Wallet } from 'lucide-react';
import { WalletDropdown } from './WalletDropdown';

interface PortfolioChartProps {
  data: PortfolioAllocation[];
  onBack: () => void;
}

const wallets = [
  {
    name: 'Coinbase Wallet',
    icon: 'https://images.ctfassets.net/q5ulk4bp65r7/1rFQCqoq8hipvVJSKdU3fQ/21ab733af7a8ab404e29b873ffb28348/coinbase-icon2.svg',
    url: 'https://coinbase.com/join/8ZWWRZQ?src=referral-link'
  },
  {
    name: 'Crypto.com',
    icon: 'https://raw.githubusercontent.com/gist/mahnunchik/23066a318de2956df3c769c87e4e6cbd/raw/e0f246d0e26ce770f3c3adca748a5a454907f8bb/crypto-com-coin-cro-logo.svg',
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
            src={`https://cryptologos.cc/logos/${data.name.toLowerCase()}-${data.name === 'Bitcoin' ? 'btc' : 
              data.name === 'Ethereum' ? 'eth' : 
              data.name === 'Solana' ? 'sol' : 
              data.name === 'Cardano' ? 'ada' : 
              data.name === 'Chainlink' ? 'link' : 
              data.name === 'Dogecoin' ? 'doge' :
              data.name.toLowerCase()}-logo.svg`}
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
          <p className="text-sm">Sentiment: {data.sentiment}</p>
          <p className="text-sm">{data.explanation}</p>
        </div>
      </div>
    );
  }
  return null;
};

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ data, onBack }) => {
  return (
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
                  <div className="flex items-center space-x-2">
                    <img 
                      src={`https://cryptologos.cc/logos/${asset.name.toLowerCase()}-${asset.name === 'Bitcoin' ? 'btc' : 
                        asset.name === 'Ethereum' ? 'eth' : 
                        asset.name === 'Solana' ? 'sol' : 
                        asset.name === 'Cardano' ? 'ada' : 
                        asset.name === 'Chainlink' ? 'link' : 
                        asset.name === 'Dogecoin' ? 'doge' :
                        asset.name.toLowerCase()}-logo.svg`}
                      alt={asset.name}
                      className="w-8 h-8"
                    />
                    <span className="font-medium">{asset.name}</span>
                    <span className="text-lg text-center">${asset.amount}</span>
                  </div>
                  <span className="text-lg font-semibold">{asset.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Portfolio Insights</h4>
              <p className="text-blue-800">
                This AI-generated portfolio is tailored to your risk profile and investment goals.
                The allocation balances potential returns with your specified risk tolerance.
              </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white mt-10 p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-6">
            <h2 className="ml-2 text-xl font-bold text-gray-900">Get Started with a Wallet</h2>
          </div>
          
          <WalletDropdown wallets={wallets} />

          <p className="mt-4 text-sm text-gray-600">
            Choose a wallet to get started with cryptocurrency. Each option offers secure storage and easy access to digital assets.
          </p>
        </div>
    </div>
  );
};