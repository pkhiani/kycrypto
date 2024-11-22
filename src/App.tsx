import React, { useState, useEffect } from 'react';
import { Welcome } from './components/Welcome';
import { KYCForm } from './components/KYCForm';
import { PortfolioSelection } from './components/PortfolioSelection';
import { PortfolioChart } from './components/PortfolioChart';
import { useKYCStore } from './store/kycStore';

function App() {
  const [step, setStep] = useState<'welcome' | 'form' | 'chart' | 'selection'>('welcome');
  const { portfolioAllocation } = useKYCStore();

  // Check payment status on mount and URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      localStorage.setItem('kycrypto_premium', 'true');
      window.history.replaceState({}, '', window.location.pathname);
      setStep('selection');
    }
  }, []);

  const handleFormSubmit = () => {
    setStep('chart');
  };

  const handleViewDetails = () => {
    const hasPremium = localStorage.getItem('kycrypto_premium') === 'true';
    if (hasPremium) {
      setStep('selection');
    }
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
          hasPremium={localStorage.getItem('kycrypto_premium') === 'true'}
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