import type { KYCFormData, PortfolioAllocation } from '../types';

// Fallback data when API is unavailable
const fallbackPortfolio: PortfolioAllocation[] = [
  {
    name: "Bitcoin",
    value: 40,
    color: "#F7931A",
    marketCap: "$1.2T",
    volume: "$28.5B",
    sentiment: "Bullish",
    volatility: "Medium"
  },
  {
    name: "Ethereum",
    value: 25,
    color: "#3C3C3D",
    marketCap: "$500B",
    volume: "$18.3B",
    sentiment: "Bullish",
    volatility: "Medium"
  },
  {
    name: "Solana",
    value: 15,
    color: "#00FFA3",
    marketCap: "$50B",
    volume: "$4B",
    sentiment: "Neutral",
    volatility: "High"
  },
  {
    name: "XRP",
    value: 10,
    color: "#346AA9",
    marketCap: "$40B",
    volume: "$3B",
    sentiment: "Neutral",
    volatility: "Medium"
  },
  {
    name: "Dogecoin",
    value: 10,
    color: "#C2A633",
    marketCap: "$20B",
    volume: "$2B",
    sentiment: "Neutral",
    volatility: "High"
  }
];

const generatePrompt = (formData: KYCFormData): string => {
  return `Based on the following investor profile, suggest a cryptocurrency portfolio allocation with percentages, risk assessment, and relevant metrics:
    - Age: ${formData.age}
    - Investment Goal: ${formData.investmentGoal}
    - Time Horizon: ${formData.timeHorizon}
    - Risk Tolerance: ${formData.riskTolerance}
    - Experience Level: ${formData.experienceLevel}
    - Investment Amount: $${formData.investmentAmount}
    - Market Expectation: ${formData.marketExpectation}
    - Volatility Comfort: ${formData.volatilityComfort}
    
    Provide only the response in the following JSON format, including only the most suitable cryptocurrencies from Bitcoin, Ethereum, Solana, XRP, and Dogecoin:

    {
      "type": "Conservative|Balanced|Aggressive",
      "allocation": [
        {
          "name": "Bitcoin",
          "value": <percentage allocation>,
          "color": "#F7931A",
          "marketCap": "$1.2T",
          "volume": "$28.5B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High"
        },
        {
          "name": "Ethereum",
          "value": <percentage allocation>,
          "color": "#3C3C3D",
          "marketCap": "$500B",
          "volume": "$18.3B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High"
        },
        {
          "name": "Solana",
          "value": <percentage allocation>,
          "color": "#00FFA3",
          "marketCap": "$50B",
          "volume": "$4B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High"
        },
        {
          "name": "XRP",
          "value": <percentage allocation>,
          "color": "#346AA9",
          "marketCap": "$40B",
          "volume": "$3B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High"
        },
        {
          "name": "Dogecoin",
          "value": <percentage allocation>,
          "color": "#C2A633",
          "marketCap": "$20B",
          "volume": "$2B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High"
        }
      ]
    }`;
};

export const getAIPortfolioRecommendation = async (
  formData: KYCFormData
): Promise<PortfolioAllocation[]> => {
  try {
    const prompt = generatePrompt(formData);
    const response = await fetch(
      'https://message-tailor-api-production.up.railway.app/api/generate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get AI recommendation');
    }

    const data = await response.json();
    
    try {
      // Clean up the response content
      const jsonContent = (data.content || data.message || '').trim();
      // Parse the JSON string
      const recommendation = JSON.parse(jsonContent);
      
      if (!recommendation.allocation || !Array.isArray(recommendation.allocation)) {
        throw new Error('Invalid allocation format');
      }

      // Validate the allocation data
      const validAllocation = recommendation.allocation.every((asset: any) => (
        typeof asset === 'object' &&
        typeof asset.name === 'string' &&
        typeof asset.value === 'number' &&
        typeof asset.color === 'string' &&
        typeof asset.marketCap === 'string' &&
        typeof asset.volume === 'string' &&
        typeof asset.sentiment === 'string' &&
        typeof asset.volatility === 'string'
      ));

      if (!validAllocation) {
        throw new Error('Invalid asset data format');
      }

      // Validate total allocation is approximately 100%
      const total = recommendation.allocation.reduce(
        (sum: number, asset: PortfolioAllocation) => sum + asset.value,
        0
      );

      if (Math.abs(total - 100) <= 1) {
        return recommendation.allocation;
      } else {
        throw new Error('Total allocation does not sum to 100%');
      }
    } catch (parseError) {
      console.warn('Error parsing AI response:', parseError);
      return adjustFallbackPortfolio(formData);
    }
  } catch (error) {
    console.warn('Error getting AI portfolio recommendation:', error);
    return adjustFallbackPortfolio(formData);
  }
};

// Adjust fallback portfolio based on user's risk profile
const adjustFallbackPortfolio = (formData: KYCFormData): PortfolioAllocation[] => {
  const portfolio = [...fallbackPortfolio];
  
  // Adjust allocations based on risk tolerance
  if (formData.riskTolerance === 'low') {
    portfolio[0].value = 0; // More Bitcoin
    portfolio[1].value = 0; // More Ethereum
    portfolio[2].value = 0; // Less Solana
    portfolio[3].value = 0;  // Less XRP
    portfolio[4].value = 0;  // Less Dogecoin
  } else if (formData.riskTolerance === 'high') {
    portfolio[0].value = 0; // Less Bitcoin
    portfolio[1].value = 0; // Less Ethereum
    portfolio[2].value = 0; // More Solana
    portfolio[3].value = 0; // More XRP
    portfolio[4].value = 0; // More Dogecoin
  }

  return portfolio;
};