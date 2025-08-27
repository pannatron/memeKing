'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount, getMint } from '@solana/spl-token';

const TARGET_TOKEN_ADDRESS = '4daoTLufDmV3ods48Zh8rymaZKBLtgEvuH9qALYLbonk';
const MINIMUM_BALANCE = 1000;

export const useTokenBalance = () => {
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMinimumBalance, setHasMinimumBalance] = useState<boolean>(false);

    const checkTokenBalance = async (retryCount = 0) => {
        if (!publicKey || !connected) {
            setBalance(0);
            setHasMinimumBalance(false);
            return;
        }

        setLoading(true);
        try {
            console.log(`Checking token balance (attempt ${retryCount + 1})...`);
            const tokenMintAddress = new PublicKey(TARGET_TOKEN_ADDRESS);
            
            // Get mint info to determine decimals with timeout
            const mintInfo = await Promise.race([
                getMint(connection, tokenMintAddress),
                new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error('RPC timeout')), 10000)
                )
            ]);
            const decimals = mintInfo.decimals;
            
            const associatedTokenAddress = await getAssociatedTokenAddress(
                tokenMintAddress,
                publicKey
            );

            try {
                const tokenAccount = await Promise.race([
                    getAccount(connection, associatedTokenAddress),
                    new Promise<never>((_, reject) => 
                        setTimeout(() => reject(new Error('RPC timeout')), 10000)
                    )
                ]);
                const tokenBalance = Number(tokenAccount.amount) / Math.pow(10, decimals);
                
                console.log('Token balance check successful:', {
                    rpcEndpoint: connection.rpcEndpoint,
                    rawAmount: tokenAccount.amount.toString(),
                    decimals,
                    calculatedBalance: tokenBalance,
                    minimumRequired: MINIMUM_BALANCE
                });
                
                setBalance(tokenBalance);
                setHasMinimumBalance(tokenBalance >= MINIMUM_BALANCE);
            } catch (error) {
                console.log('Token account does not exist or error:', error);
                // Token account doesn't exist, balance is 0
                setBalance(0);
                setHasMinimumBalance(false);
            }
        } catch (error) {
            console.error(`Error checking token balance (attempt ${retryCount + 1}):`, error);
            
            // Retry up to 3 times with exponential backoff
            if (retryCount < 2) {
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                console.log(`Retrying in ${delay}ms...`);
                setTimeout(() => checkTokenBalance(retryCount + 1), delay);
                return;
            }
            
            setBalance(0);
            setHasMinimumBalance(false);
        } finally {
            if (retryCount === 0) { // Only set loading false on the initial call
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        checkTokenBalance();
    }, [publicKey, connected, connection]);

    return {
        balance,
        loading,
        hasMinimumBalance,
        minimumRequired: MINIMUM_BALANCE,
        tokenAddress: TARGET_TOKEN_ADDRESS,
        refetch: checkTokenBalance
    };
};
