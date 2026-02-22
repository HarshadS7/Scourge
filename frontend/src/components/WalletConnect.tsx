'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { monadTestnet } from '@/lib/wagmi';

/**
 * Wallet Connection Component
 * Displays connect button and wallet info
 */
export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    chainId: monadTestnet.id,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Connect Button */}
      <ConnectButton 
        chainStatus="icon"
        showBalance={{
          smallScreen: false,
          largeScreen: true,
        }}
      />

      {/* Wallet Info */}
      {isConnected && address && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Address:</span>
            <code className="text-xs bg-gray-900 px-2 py-1 rounded">
              {address.slice(0, 6)}...{address.slice(-4)}
            </code>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Balance:</span>
            <span className="text-sm font-mono">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0 MONAD'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Custom Connect Button (if you prefer custom styling)
 */
export function CustomConnectButton() {
  const { address, isConnected } = useAccount();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="flex gap-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
