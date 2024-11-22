import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ExternalLink } from 'lucide-react';
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
  const [selectedAsset, setSelectedAsset] = useState<PortfolioAllocation | null>(null);

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
              Back to Chart
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Detailed Analysis</h2>
          </div>

          <div className="mb-8">
            <div className="relative">
              <button
                onClick={() => setSelectedAsset(null)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center">
                  {selectedAsset ? (
                    <>
                      <img
                        src={`/assets/crypto/${selectedAsset.name.toLowerCase()}.svg`}
                        alt={selectedAsset.name}
                        className="w-6 h-6 mr-2"
                      />
                      <span className="text-gray-900 font-medium">{selectedAsset.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-700 font-medium">Select a Cryptocurrency</span>
                  )}
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>

              {!selectedAsset && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {data.map((asset) => (
                    <button
                      key={asset.name}
                      onClick={() => setSelectedAsset(asset)}
                      className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={`/assets/crypto/${asset.name.toLowerCase()}.svg`}
                        alt={asset.name}
                        className="w-6 h-6 mr-2"
                      />
                      <span className="text-gray-900">{asset.name}</span>
                      <span className="ml-auto text-gray-500">{asset.value}%</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedAsset && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedAsset.name} Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">Market Cap: {selectedAsset.marketCap}</p>
                    <p className="text-gray-600">24h Volume: {selectedAsset.volume}</p>
                    <p className="text-gray-600">Volatility: {selectedAsset.volatility}</p>
                    <p className="text-gray-600">Market Sentiment: {selectedAsset.sentiment}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Recommended Allocation: {selectedAsset.value}%</p>
                    <p className="text-gray-600">{selectedAsset.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onConfirm}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};