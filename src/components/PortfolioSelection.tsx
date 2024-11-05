import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { PortfolioAllocation } from '../types';

interface PortfolioSelectionProps {
  data: PortfolioAllocation[];
  onConfirm: () => void;
  onBack: () => void;
}

export const PortfolioSelection: React.FC<PortfolioSelectionProps> = ({ 
  data, 
  onConfirm, 
  onBack 
}) => {
  const totalValue = data.reduce((sum, asset) => sum + asset.value, 0);
  const riskLevel = data.reduce((risk, asset) => {
    const volatilityScore = asset.volatility === 'High' ? 3 : 
                           asset.volatility === 'Medium' ? 2 : 1;
    return risk + (volatilityScore * (asset.value / totalValue));
  }, 0);

  const getRiskProfile = (score: number) => {
    if (score <= 1.5) return 'Conservative';
    if (score <= 2.2) return 'Balanced';
    return 'Aggressive';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </button>
            <h2 className="text-2xl font-bold text-gray-900">AI-Generated Portfolio</h2>
          </div>

          <div className="mb-8">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Portfolio Risk Profile: {getRiskProfile(riskLevel)}
              </h3>
              <p className="text-blue-800">
                This portfolio has been tailored to your risk tolerance and investment goals.
              </p>
            </div>

            <div className="space-y-4">
              {data.map((asset) => (
                <div 
                  key={asset.name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://cryptologos.cc/logos/${asset.name.toLowerCase()}-${
                        asset.name === 'Bitcoin' ? 'btc' :
                        asset.name === 'Ethereum' ? 'eth' :
                        asset.name === 'Solana' ? 'sol' :
                        asset.name === 'Cardano' ? 'ada' :
                        asset.name === 'Polkadot' ? 'dot' :
                        asset.name === 'Dogecoin' ? 'doge' :
                        asset.name.toLowerCase()
                      }-logo.svg`}
                      alt={asset.name}
                      className="w-8 h-8"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{asset.name}</h4>
                      <p className="text-sm text-gray-500">
                        {asset.sentiment} • {asset.volatility} Risk
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{asset.value}%</p>
                    <p className="text-sm text-gray-500">Market Cap: {asset.marketCap}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onConfirm}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Detailed Analysis
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};