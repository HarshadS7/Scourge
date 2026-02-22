/**
 * Contract Data Inspector
 * Shows real-time contract data in development
 */

'use client';

import { useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { CAMPAIGN_MANAGER_ABI } from '@/lib/contracts/abis';

export function ContractDataInspector() {
  const { data: totalCampaigns } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'getTotalCampaigns',
  });

  useEffect(() => {
    if (totalCampaigns !== undefined) {
      console.log('%c📊 REAL BLOCKCHAIN DATA', 'font-size: 16px; font-weight: bold; color: #00ff00;');
      console.log('%cContract Address:', 'font-weight: bold;', CONTRACT_ADDRESSES.CAMPAIGN_MANAGER);
      console.log('%cTotal Campaigns:', 'font-weight: bold;', totalCampaigns.toString());
      console.log('%cNetwork:', 'font-weight: bold;', 'Monad Testnet (Chain ID: 41454)');
      console.log('%cRPC:', 'font-weight: bold;', process.env.NEXT_PUBLIC_MONAD_RPC_URL);
      
      if (Number(totalCampaigns) === 0) {
        console.log('%c⚠️ No campaigns created yet!', 'font-size: 14px; color: #ff9900;');
        console.log('%cCreate one with:', 'color: #0099ff;');
        console.log('  cd contracts && forge script script/Interact.s.sol --sig "createCampaign()" --rpc-url $MONAD_RPC_URL --broadcast --legacy');
      } else {
        console.log(`%c✅ ${totalCampaigns} campaign(s) found on blockchain!`, 'font-size: 14px; color: #00ff00;');
      }
    }
  }, [totalCampaigns]);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return null;
}
