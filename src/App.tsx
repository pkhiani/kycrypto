import React, { useState } from 'react';
import { Welcome } from './components/Welcome';
import { KYCForm } from './components/KYCForm';
import { PortfolioSelection } from './components/PortfolioSelection';
import { PortfolioChart } from './components/PortfolioChart';
import { useKYCStore } from './store/kycStore';

function App() {
  const [step, setStep] = useState<'welcome' | 'form' | 'selection' | 'result'>('welcome');
  const { portfolioAllocation } = useKYCStore();

  const handleFormSubmit = () => {
    setStep('selection');
  };

  const handlePortfolioConfirm = () => {
    setStep('result');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'welcome' && <Welcome onStart={() => setStep('form')} />}
      {step === 'form' && <KYCForm onSubmit={handleFormSubmit} />}
      {step === 'selection' && (
        <PortfolioSelection 
          data={portfolioAllocation}
          onConfirm={handlePortfolioConfirm}
          onBack={() => setStep('form')}
        />
      )}
      {step === 'result' && (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <PortfolioChart 
            data={portfolioAllocation} 
            onBack={() => setStep('selection')} 
          />
        </div>
      )}
    </div>
  );
}

export default App;