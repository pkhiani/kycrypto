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
  color: string;
  marketCap: string;
  volume: string;
  sentiment: string;
  volatility: string;
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