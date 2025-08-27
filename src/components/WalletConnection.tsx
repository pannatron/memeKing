'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { Lock, RefreshCw, CheckCircle } from 'lucide-react';

interface WalletConnectionProps {
    onAccessGranted?: (hasAccess: boolean) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onAccessGranted }) => {
    const { connected, publicKey } = useWallet();
    const { balance, loading, hasMinimumBalance, refetch } = useTokenBalance();

    React.useEffect(() => {
        if (onAccessGranted) {
            onAccessGranted(hasMinimumBalance);
        }
    }, [hasMinimumBalance, onAccessGranted]);

    const formatBalance = (balance: number): string => {
        if (balance >= 1e9) return `${(balance / 1e9).toFixed(2)}B`;
        if (balance >= 1e6) return `${(balance / 1e6).toFixed(2)}M`;
        if (balance >= 1e3) return `${(balance / 1e3).toFixed(2)}K`;
        return balance.toFixed(2);
    };

    const truncateAddress = (address: string): string => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div>
            <div className="bg-gradient-to-r from-gray-800/95 to-gray-700/95 rounded-lg p-2 backdrop-blur-sm border border-yellow-500/30 shadow-lg relative">
                <div className="flex items-center space-x-2">
                {/* Status indicator */}
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                
                {/* Custom wallet display */}
                {connected && publicKey ? (
                    <div className="flex items-center space-x-2">
                        {/* Wallet address button */}
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-md transition-all text-xs px-2 py-1 text-white font-medium"
                        >
                            {truncateAddress(publicKey.toString())}
                        </button>
                        
                        {/* Token balance */}
                        <div className="text-xs text-yellow-300 font-bold">
                            {loading ? '...' : formatBalance(balance)}
                        </div>
                        
                        {/* Refresh button */}
                        <button
                            onClick={() => refetch()}
                            disabled={loading}
                            className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                            title="Refresh balance"
                        >
                            <RefreshCw className={`h-3 w-3 text-gray-300 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        
                        {/* Access status icon */}
                        {hasMinimumBalance ? (
                            <div title="Access Granted">
                                <CheckCircle className="h-3 w-3 text-green-400" />
                            </div>
                        ) : (
                            <div title="Need 1,000+ tokens">
                                <Lock className="h-3 w-3 text-red-400" />
                            </div>
                        )}
                    </div>
                ) : (
                    /* Connect wallet button for non-connected state */
                    <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-500 hover:!to-blue-500 !rounded-md !transition-all !text-xs !px-2 !py-1 !min-h-0" />
                )}
            </div>
            
            {/* Custom dropdown menu */}
            {showDropdown && connected && (
                <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-[150px]">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(publicKey?.toString() || '');
                            setShowDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-t-lg"
                    >
                        Copy address
                    </button>
                    <WalletDisconnectButton className="!w-full !text-left !px-3 !py-2 !text-sm !text-white !hover:bg-gray-700 !rounded-b-lg !bg-transparent !border-0" />
                </div>
            )}
            
                {/* Click outside to close dropdown */}
                {showDropdown && (
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowDropdown(false)}
                    />
                )}
            </div>
        </div>
    );
};
