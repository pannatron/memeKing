'use client';

import React from 'react';
import { ShoppingCart, ExternalLink, Coins, Lock } from 'lucide-react';

interface BuyTokenPromptProps {
  isVisible: boolean;
  connected: boolean;
  minimumRequired: number;
}

export const BuyTokenPrompt: React.FC<BuyTokenPromptProps> = ({ 
  isVisible, 
  connected, 
  minimumRequired 
}) => {
  // DexScreener link for buying tokens
  const buyTokenLink = "https://dexscreener.com/solana/2kv6hkaaij9vc7xhl8pfzxelcfekjw9o8zx3xl155gm3";

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="bg-gray-800/90 rounded-lg p-4 backdrop-blur-sm border border-gray-600/50 shadow-lg max-w-xs mx-4">
        <div className="text-center">
          {/* Simple message */}
          <div className="mb-3">
            <Lock className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium mb-1">
              {!connected ? 'Connect Wallet' : 'Need 1,000+ Tokens'}
            </p>
            <p className="text-gray-300 text-xs">
              {!connected ? 'to access features' : 'to unlock table'}
            </p>
          </div>
          
          {/* Simple buy button */}
          <a
            href={buyTokenLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            <ShoppingCart className="h-3 w-3" />
            <span>Buy</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
