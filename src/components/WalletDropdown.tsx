import React, { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, ExternalLink } from 'lucide-react';

interface WalletOption {
  name: string;
  icon: string;
  url: string;
}

interface WalletDropdownProps {
  wallets: WalletOption[];
}

export function WalletDropdown({ wallets }: WalletDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center">
          <Wallet className="h-5 w-5 text-blue-600" />
          <span className="ml-2 text-gray-700 font-medium">Select a Wallet</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {wallets.map((wallet) => (
            <a
              key={wallet.name}
              href={wallet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <img src={wallet.icon} alt={wallet.name} className="h-6 w-6" />
                <span className="ml-3 text-gray-700">{wallet.name}</span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}