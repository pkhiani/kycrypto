import { create } from 'zustand';
import type { KYCFormData, PortfolioAllocation } from '../types';

interface KYCStore {
  formData: Partial<KYCFormData>;
  portfolioAllocation: PortfolioAllocation[];
  setFormData: (data: Partial<KYCFormData>) => void;
  setPortfolioAllocation: (allocation: PortfolioAllocation[]) => void;
}

export const useKYCStore = create<KYCStore>((set) => ({
  formData: {},
  portfolioAllocation: [],
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setPortfolioAllocation: (allocation) => set({ portfolioAllocation: allocation }),
}));