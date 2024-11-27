import type { KYCFormData, PortfolioAllocation } from '../types';
import axios from 'axios';

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
    
    Provide only the response in the following JSON format, including only the most suitable cryptocurrencies from Bitcoin, Ethereum, Solana, XRP, Dogecoin, Chainlink and Cardano:

    {
      "type": "Conservative|Balanced|Aggressive",
      "allocation": [
        {
          "name": "<crypto name>",
          "value": <percentage allocation>,
          "amount": <investment amount allocation>,
          "color": "<hex color>",
          "marketCap": "<market cap>",
          "volume": "<volume>",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High",
          "explanation": <explanation on why the user should buy this crypto based on their inputs>,
          "riskAssessment": <identify and analyze the risks for this kind of investment>
        }
      ]
    }
    Use the following colors:
    Bitcoin: #F7931A,
    Ethereum: #3C3C3D,
    Solana: #00FFA3,
    XRP: #346AA9,
    Dogecoin: #C2A633,
    Chainlink: #0847F7,
    Cardano: #0031B4
    `;
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
    console.log(data);

    // Extract JSON string by removing code block delimiters if present
    const jsonContent = data.replace(/^```json|```$/g, '').trim();
    

    try {
      const recommendation = JSON.parse(jsonContent);
      if (Array.isArray(recommendation.allocation)) {
        // Fetch live market data for recommended cryptocurrencies
        const liveData = await fetchLiveMarketData(recommendation.allocation);
        const adjustedRecommendation = recommendation.allocation.map((asset, index) => ({
          ...asset,
          ...liveData[index],
        }));
        return adjustedRecommendation;
      }
      throw new Error('Invalid allocation data');
    } catch (parseError) {
      console.warn('Error parsing AI response, using fallback data:', parseError);
      return adjustFallbackPortfolio(formData);
    }
  } catch (error) {
    console.warn('Error getting AI portfolio recommendation, using fallback data:', error);
    return adjustFallbackPortfolio(formData);
  }
};

const fetchLiveMarketData = async (
  allocation: PortfolioAllocation[]
): Promise<PortfolioAllocation[]> => {
  try {
    const symbols = allocation
      .map((asset) => asset.name.toLowerCase())
      .join(',');

    const response = await axios.get(
      `https://message-tailor-api-production.up.railway.app/crypto/market-data?symbols=${symbols}`
    );

    // If we have valid market data, update the allocations
    if (response.data && response.data.data) {
      return allocation.map(asset => {
        const marketData = response.data.data.find(
          (coin: any) => coin.name.toLowerCase() === asset.name.toLowerCase()
        );

        if (!marketData) {
          return {
            ...asset,
            marketCap: 'N/A',
            volume: 'N/A',
            volatility: 'N/A'
          };
        }

        return {
          ...asset,
          marketCap: marketData.marketCap,
          volume: marketData.volume,
          // currentPrice: marketData.price,
          volatility: marketData.percentChange24h
        };
      });
    }

    return allocation;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return allocation;
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