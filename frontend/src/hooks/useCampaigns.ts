/**
 * useCampaigns Hook - Fetch and manage campaigns from CampaignManager contract
 */

'use client';

import { useEffect, useState } from 'react';
import { useReadContract, useContractReads } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { CAMPAIGN_MANAGER_ABI } from '@/lib/contracts/abis';
import { formatEther } from 'viem';

export interface Campaign {
  id: number;
  company: string;
  metadataFilecoinCID: string;
  metadataHash: string;
  pricePerSubmission: bigint;
  totalBudget: bigint;
  deadline: bigint;
  collectionDuration: bigint;
  submissionCount: bigint;
  active: boolean;
  constraintsHash: string;
  // Derived fields
  title?: string;
  description?: string;
  attributes?: string[];
  companyName?: string;
  status: 'active' | 'closing' | 'filled';
  budgetUsed: number;
  priceFormatted: string;
  budgetFormatted: string;
  deadlineDate: string;
}

export interface CampaignMetadata {
  title: string;
  description: string;
  companyName: string;
  attributes: string[];
  region?: string;
  minAge?: number;
  maxAge?: number;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  // Get total number of campaigns
  const { data: totalCampaigns, isLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'getTotalCampaigns',
  });

  useEffect(() => {
    async function fetchAllCampaigns() {
      if (!totalCampaigns || isError || isLoading) {
        return;
      }

      const total = Number(totalCampaigns);
      if (total === 0) {
        setCampaigns([]);
        return;
      }

      setIsLoadingMetadata(true);

      try {
        // Fetch all campaigns from contract
        const campaignPromises: Promise<Campaign | null>[] = [];
        
        for (let i = 0; i < total; i++) {
          campaignPromises.push(fetchCampaignById(i));
        }

        const results = await Promise.allSettled(campaignPromises);
        const validCampaigns = results
          .filter((r): r is PromiseFulfilledResult<Campaign> => 
            r.status === 'fulfilled' && r.value !== null
          )
          .map(r => r.value);

        setCampaigns(validCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoadingMetadata(false);
      }
    }

    fetchAllCampaigns();
  }, [totalCampaigns, isError, isLoading]);

  return {
    campaigns,
    isLoading: isLoading || isLoadingMetadata,
    isError,
    refetch,
    totalCount: Number(totalCampaigns || 0),
  };
}

async function fetchCampaignById(campaignId: number): Promise<Campaign | null> {
  try {
    // Fetch campaign data from contract using direct RPC call
    const rpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz';
    
    // Encode getCampaign(uint256) call
    const functionSelector = '0x58cf6f25'; // keccak256("getCampaign(uint256)")[:8]
    const encodedId = campaignId.toString(16).padStart(64, '0');
    const callData = functionSelector + encodedId;

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [
          {
            to: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
            data: callData,
          },
          'latest',
        ],
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      console.error(`Error fetching campaign ${campaignId}:`, result.error);
      return null;
    }

    // Decode the response (simplified - this would need proper ABI decoding)
    // For now, return a campaign with the ID and mark as needing metadata
    const campaign = {
      id: campaignId,
      company: `0x${result.result.slice(26, 66)}`, // Extract address from response
      metadataFilecoinCID: `bafybeig${campaignId}`, // Placeholder
      metadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      pricePerSubmission: BigInt(1000000000000000), // 0.001 ETH placeholder
      totalBudget: BigInt(10000000000000000), // 0.01 ETH placeholder
      deadline: BigInt(Date.now() / 1000 + 30 * 24 * 60 * 60), // 30 days from now
      collectionDuration: BigInt(7 * 24 * 60 * 60), // 7 days
      submissionCount: BigInt(campaignId * 3), // Placeholder
      active: true,
      constraintsHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      
      // UI fields
      title: `Campaign #${campaignId}`,
      description: `Data collection campaign ${campaignId}`,
      companyName: `Company ${campaignId}`,
      attributes: ['Age Range', 'Region', 'Spend'],
      status: 'active' as const,
      budgetUsed: Math.min(campaignId * 10 + 20, 95),
      priceFormatted: `${formatEther(BigInt(1000000000000000))} ETH`,
      budgetFormatted: `${formatEther(BigInt(10000000000000000))} ETH`,
      deadlineDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    return campaign;
  } catch (error) {
    console.error(`Failed to fetch campaign ${campaignId}:`, error);
    return null;
  }
}

/**
 * Hook to fetch a single campaign by ID
 */
export function useCampaign(campaignId: number) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isError } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'getCampaign',
    args: [BigInt(campaignId)],
  });

  useEffect(() => {
    async function loadCampaign() {
      if (!data || isError) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await fetchCampaignById(campaignId);
        setCampaign(result);
      } catch (error) {
        console.error('Error loading campaign:', error);
        setCampaign(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadCampaign();
  }, [data, isError, campaignId]);

  return { campaign, isLoading, isError };
}
