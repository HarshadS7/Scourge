/**
 * Debug Panel Component
 * Shows contract addresses and connection status
 * Only visible in development mode
 */

'use client';

import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, address, chain } = useAccount();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div className="bauhaus-card bg-bauhaus-black text-bauhaus-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 hover:bg-bauhaus-white/10 transition-colors"
        >
          <span className="text-xs font-mono uppercase tracking-wider">
            🔧 Debug Panel
          </span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        {isOpen && (
          <div className="p-4 pt-0 space-y-4 text-xs font-mono">
            {/* Connection Status */}
            <div>
              <h4 className="text-bauhaus-yellow font-semibold mb-2">Connection</h4>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-bauhaus-white/50">Status:</span>
                  <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                    {isConnected ? '✓ Connected' : '✗ Not Connected'}
                  </span>
                </div>
                {isConnected && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-bauhaus-white/50">Chain:</span>
                      <span>{chain?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bauhaus-white/50">Chain ID:</span>
                      <span>{chain?.id || 'N/A'}</span>
                    </div>
                    <div className="text-bauhaus-white/50 break-all mt-2">
                      {address}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contract Addresses */}
            <div>
              <h4 className="text-bauhaus-yellow font-semibold mb-2">Contracts</h4>
              <div className="space-y-1.5 text-[10px]">
                {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
                  <div key={name} className="space-y-0.5">
                    <div className="text-bauhaus-white/50">
                      {name.replace(/_/g, ' ')}:
                    </div>
                    <div className="text-bauhaus-blue break-all font-mono">
                      {addr}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment */}
            <div>
              <h4 className="text-bauhaus-yellow font-semibold mb-2">Environment</h4>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-bauhaus-white/50">Mode:</span>
                  <span>{process.env.NODE_ENV}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bauhaus-white/50">RPC:</span>
                  <span className="text-bauhaus-white/70 truncate max-w-[150px]">
                    {process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'Not Set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Links */}
            <div>
              <h4 className="text-bauhaus-yellow font-semibold mb-2">Quick Links</h4>
              <div className="space-y-1.5">
                <a
                  href="https://testnet-explorer.monad.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-bauhaus-blue hover:underline text-[10px]"
                >
                  → Monad Explorer
                </a>
                <a
                  href={`https://testnet-explorer.monad.xyz/address/${CONTRACT_ADDRESSES.CAMPAIGN_MANAGER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-bauhaus-blue hover:underline text-[10px]"
                >
                  → CampaignManager Contract
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
