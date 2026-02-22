/**
 * Network Status Component
 * Shows connection status and network info
 */

'use client';

import { useAccount, useBlockNumber, useBalance } from 'wagmi';
import { monadTestnet } from '@/lib/wagmi';
import { useEffect, useState } from 'react';

export function NetworkStatus() {
  const { address, isConnected, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance } = useBalance({ address });
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  useEffect(() => {
    setIsCorrectNetwork(chain?.id === monadTestnet.id);
  }, [chain]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bauhaus-card p-4 max-w-xs bg-bauhaus-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm uppercase tracking-wide">Network Status</h3>
          <div 
            className={`w-2.5 h-2.5 rounded-full ${
              isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={isCorrectNetwork ? 'Connected' : 'Wrong Network'}
          />
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-bauhaus-black/50">Chain:</span>
            <span className="font-semibold">
              {chain?.name || 'Unknown'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-bauhaus-black/50">Chain ID:</span>
            <span className={chain?.id === monadTestnet.id ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {chain?.id || 'N/A'}
            </span>
          </div>

          {blockNumber && (
            <div className="flex justify-between">
              <span className="text-bauhaus-black/50">Block:</span>
              <span className="font-semibold">#{blockNumber.toString()}</span>
            </div>
          )}

          {balance && (
            <div className="flex justify-between">
              <span className="text-bauhaus-black/50">Balance:</span>
              <span className="font-semibold">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-bauhaus-black/10">
            <div className="text-[10px] text-bauhaus-black/40 break-all">
              {address}
            </div>
          </div>
        </div>

        {!isCorrectNetwork && (
          <div className="mt-3 p-2 bg-red-50 border-2 border-red-600 text-xs">
            <p className="text-red-800 font-semibold">⚠️ Wrong Network</p>
            <p className="text-red-600 text-[10px] mt-1">
              Please switch to Monad Testnet (Chain ID: {monadTestnet.id})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
