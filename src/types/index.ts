export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive';
export type TimeHorizon = 'Short' | 'Medium' | 'Long';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface KYCFormData {
  age: string;
  investmentGoal: string;
  timeHorizon: TimeHorizon;
  riskTolerance: string;
  experienceLevel: ExperienceLevel;
  investmentAmount: number;
  volatilityComfort: string;
  marketExpectation: string;
}

export interface PortfolioAllocation {
  name: string;
  value: number;
  // amount: string;
  color: string;
  marketCap: string;
  volume: string;
  sentiment: string;
  volatility: string;
  // currentPrice?: number;
  // priceChange24h?: number;
  // explanation?: string;
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  marketCap: string;
  volume: string;
  sentiment: string;
  volatility: string;
}