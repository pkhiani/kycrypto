import React from 'react';
import type { PortfolioAllocation } from '../types';

interface PrintablePortfolioProps {
  data: PortfolioAllocation[];
}

export const PrintablePortfolio: React.FC<PrintablePortfolioProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="printable-portfolio p-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Analysis Report</h1>
          <p className="text-gray-600">Generated on {currentDate}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Portfolio Overview</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Total Assets: {data.length}</p>
              <p className="text-gray-600">Portfolio Type: {getPortfolioType(data)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">Total Allocation: 100%</p>
              <p className="text-gray-600">Risk Profile: {getRiskProfile(data)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {data.map((asset) => (
            <div key={asset.name} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={`/assets/crypto/${asset.name.toLowerCase()}.svg`}
                    alt={asset.name}
                    className="w-8 h-8 mr-3"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">{asset.name}</h3>
                </div>
                <span className="text-lg font-bold text-blue-600">{asset.value}% Allocation</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Market Metrics</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600">Market Cap: {asset.marketCap}</p>
                    <p className="text-gray-600">24h Volume: {asset.volume}</p>
                    <p className="text-gray-600">Volatility: {asset.volatility}</p>
                    <p className="text-gray-600">Market Sentiment: {asset.sentiment}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Investment Analysis</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600">{asset.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This report is generated by KYCrypto - AI-Powered Portfolio Analysis</p>
          <p>For informational purposes only. Not financial advice.</p>
        </div>
      </div>
    </div>
  );
};

function getPortfolioType(data: PortfolioAllocation[]): string {
  const bitcoinAllocation = data.find(asset => asset.name === 'Bitcoin')?.value || 0;
  if (bitcoinAllocation > 50) return 'Conservative';
  if (bitcoinAllocation >= 40) return 'Balanced';
  return 'Aggressive';
}

function getRiskProfile(data: PortfolioAllocation[]): string {
  const stableCoins = ['Bitcoin', 'Ethereum'];
  const stableCoinAllocation = data
    .filter(asset => stableCoins.includes(asset.name))
    .reduce((sum, asset) => sum + asset.value, 0);

  if (stableCoinAllocation >= 70) return 'Low Risk';
  if (stableCoinAllocation >= 50) return 'Moderate Risk';
  return 'High Risk';
}