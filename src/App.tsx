import React, { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { KYCForm } from './components/KYCForm';
import { PortfolioSelection } from './components/PortfolioSelection';
import { PortfolioChart } from './components/PortfolioChart';
import { useKYCStore } from './store/kycStore';

function App() {
  const [step, setStep] = useState<'welcome' | 'form' | 'chart' | 'selection'>('welcome');
  const { portfolioAllocation, setPortfolioAllocation } = useKYCStore();

  // Check payment status and restore portfolio data on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const expirationTime = Date.now() + (12 * 60 * 60 * 1000);
      localStorage.setItem('kycrypto_premium', 'true');
      localStorage.setItem('kycrypto_premium_expiration', expirationTime.toString());
      window.history.replaceState({}, '', window.location.pathname);
      
      // Restore saved portfolio data
      const savedPortfolio = localStorage.getItem('kycrypto_portfolio');
      if (savedPortfolio) {
        setPortfolioAllocation(JSON.parse(savedPortfolio));
        localStorage.removeItem('kycrypto_portfolio'); // Clean up
        setStep('selection');
      }
    }

    // Check premium expiration
    const premiumExpiration = localStorage.getItem('kycrypto_premium_expiration');
    if (premiumExpiration && Date.now() > parseInt(premiumExpiration)) {
      localStorage.removeItem('kycrypto_premium');
      localStorage.removeItem('kycrypto_premium_expiration');
    }
  }, [setPortfolioAllocation]);

  const handleFormSubmit = () => {
    setStep('chart');
  };

  const handleViewDetails = () => {
    const hasPremium = localStorage.getItem('kycrypto_premium') === 'true';
    const premiumExpiration = localStorage.getItem('kycrypto_premium_expiration');
    
    if (hasPremium && premiumExpiration && Date.now() <= parseInt(premiumExpiration)) {
      setStep('selection');
    }
  };

  const checkPremiumStatus = () => {
    const premiumExpiration = localStorage.getItem('kycrypto_premium_expiration');
    return (
      localStorage.getItem('kycrypto_premium') === 'true' &&
      premiumExpiration &&
      Date.now() <= parseInt(premiumExpiration)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'welcome' && <Welcome onStart={() => setStep('form')} />}
      {step === 'form' && <KYCForm onSubmit={handleFormSubmit} />}
      {step === 'chart' && (
        <PortfolioChart 
          data={portfolioAllocation} 
          onBack={() => setStep('form')}
          onViewDetails={handleViewDetails}
          hasPremium={checkPremiumStatus()}
        />
      )}
      {step === 'selection' && (
        <PortfolioSelection 
          data={portfolioAllocation}
          onBack={() => setStep('chart')}
          onConfirm={() => setStep('chart')}
        />
      )}
    </div>
  );
}

export default App;