import React, { useState } from 'react';
import { useKYCStore } from '../store/kycStore';
import type { ExperienceLevel, TimeHorizon } from '../types';
import { Loader } from 'lucide-react';
import { getAIPortfolioRecommendation } from '../services/portfolioService';

export const KYCForm: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const { formData, setFormData, setPortfolioAllocation } = useKYCStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleExperienceChange = (level: ExperienceLevel) => {
    setFormData({ experienceLevel: level });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const aiRecommendation = await getAIPortfolioRecommendation(formData as any);
      setPortfolioAllocation(aiRecommendation);
      onSubmit();
    } catch (error) {
      console.error('Error getting portfolio recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6 space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ age: e.target.value })}
                    required
                  >
                    <option value="">Select age range</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46-55">46-55</option>
                    <option value="56+">56+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.investmentAmount || ''}
                    onChange={(e) => setFormData({ investmentAmount: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Investment Profile */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Investment Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Goal</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.investmentGoal || ''}
                    onChange={(e) => setFormData({ investmentGoal: e.target.value })}
                    required
                  >
                    <option value="">Select goal</option>
                    <option value="growth">Aggressive Growth</option>
                    <option value="balanced">Balanced Growth</option>
                    <option value="conservative">Conservative Growth</option>
                    <option value="income">Income Generation</option>
                    <option value="preservation">Capital Preservation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.timeHorizon || ''}
                    onChange={(e) => setFormData({ timeHorizon: e.target.value as TimeHorizon })}
                    required
                  >
                    <option value="">Select time horizon</option>
                    <option value="Short">Short Term (1-3 years)</option>
                    <option value="Medium">Medium Term (3-7 years)</option>
                    <option value="Long">Long Term (7+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.riskTolerance || ''}
                    onChange={(e) => setFormData({ riskTolerance: e.target.value })}
                    required
                  >
                    <option value="">Select risk tolerance</option>
                    <option value="low">Low - Prefer stability over growth</option>
                    <option value="medium">Medium - Balance between stability and growth</option>
                    <option value="high">High - Willing to accept volatility for growth</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Market Understanding */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Market Understanding</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <div className="flex space-x-4">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`px-4 py-2 rounded-full ${
                        formData.experienceLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handleExperienceChange(level as ExperienceLevel)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Expectation</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.marketExpectation || ''}
                  onChange={(e) => setFormData({ marketExpectation: e.target.value })}
                  required
                >
                  <option value="">Select market expectation</option>
                  <option value="bearish">Bearish - Expect market decline</option>
                  <option value="neutral">Neutral - Expect sideways movement</option>
                  <option value="bullish">Bullish - Expect market growth</option>
                </select>
              </div>
            </div>

            {/* Volatility Comfort */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Risk Assessment</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How would you react to a 20% drop in your portfolio value?
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.volatilityComfort || ''}
                  onChange={(e) => setFormData({ volatilityComfort: e.target.value })}
                  required
                >
                  <option value="">Select response</option>
                  <option value="sell">Sell immediately to prevent further losses</option>
                  <option value="concerned">Be very concerned and consider selling</option>
                  <option value="hold">Hold and wait for recovery</option>
                  <option value="buy">See it as a buying opportunity</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Analyzing Profile...
                </>
              ) : (
                'Get AI Recommendation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};