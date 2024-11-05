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
    
    Provide only the response in the following JSON format, including only the most suitable cryptocurrencies from Bitcoin, Ethereum, Solana, XRP, Dogecoin, Polkadot and Cardano:

    {
      "type": "Conservative|Balanced|Aggressive",
      "allocation": [
        {
          "name": "Bitcoin",
          "value": <percentage allocation>,
          "amount": <investment amount allocation>,
          "color": "#F7931A",
          "marketCap": "$1.2T",
          "volume": "$28.5B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High",
          "explanation": <explanation on why the user should buy this crypto based on their inputs>
        },
        {
          "name": "Ethereum",
          "value": <percentage allocation>,
          "amount": <investment amount allocation>,
          "color": "#3C3C3D",
          "marketCap": "$500B",
          "volume": "$18.3B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High",
          "explanation": <explanation on why the user should buy this crypto based on their inputs>
        },
        {
          "name": "Solana",
          "value": <percentage allocation>,
          "amount": <investment amount allocation>,
          "color": "#00FFA3",
          "marketCap": "$50B",
          "volume": "$4B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High",
          "explanation": <explanation on why the user should buy this crypto based on their inputs>
        },
        {
          "name": "XRP",
          "value": <percentage allocation>,
          "amount": <investment amount allocation>,
          "color": "#346AA9",
          "marketCap": "$40B",
          "volume": "$3B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High",
          "explanation": <explanation on why the user should buy this crypto based on their inputs>
        },
        {
          "name": "Dogecoin",
          "value": <percentage allocation>,
          "amount": <investment amount allocation>,
          "color": "#C2A633",
          "marketCap": "$20B",
          "volume": "$2B",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High",
          "explanation": <explanation on why the user should buy this crypto based on their inputs>
        },
        {
          "name": "Polkadot",
          "value": <percentage allocation>,
          "amount": <investment amount allocation>,
          "color": "#E6007A",
          "marketCap": "$5.9B",
          "volume": "$130M",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High",
          "explanation": <explanation on why the user should buy this crypto based on their inputs>
        },
        {
          "name": "Cardano",
          "value": <percentage allocation>,
          "amount": <investment amount allocation>,
          "color": "#0031B4",
          "marketCap": "$12.5B",
          "volume": "$250M",
          "sentiment": "Bullish|Neutral|Bearish",
          "volatility": "Low|Medium|High",
          "explanation": <explanation on why the user should buy this crypto based on their inputs>
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
    console.log(data);

    // Extract JSON string by removing code block delimiters if present
    const jsonContent = data.replace(/^```json|```$/g, '').trim();
    

    try {
      const recommendation = JSON.parse(jsonContent);
      if (Array.isArray(recommendation.allocation)) {
        const total = recommendation.allocation.reduce((sum: number, asset: PortfolioAllocation) => sum + asset.value, 0);
        if (Math.abs(total - 100) <= 1) {
          return recommendation.allocation;
        }
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