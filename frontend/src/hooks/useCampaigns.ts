/**
 * useCampaigns Hook - Fetch and manage campaigns from CampaignManager contract
 */

'use client';

import { useEffect, useState } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
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
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

  // Get total number of campaigns
  const { data: totalCampaigns, isLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'getTotalCampaigns',
  });

  // Fetch all campaigns when total changes
  useEffect(() => {
    async function fetchAllCampaigns() {
      if (!totalCampaigns || isError || isLoading) {
        return;
      }

      const total = Number(totalCampaigns);
      console.log(`📊 Total campaigns on blockchain: ${total}`);
      
      if (total === 0) {
        setCampaigns([]);
        return;
      }

      setIsLoadingCampaigns(true);

      try {
        // Create contract read calls for all campaigns
        const campaignContracts = [];
        const activeContracts = [];
        
        for (let i = 0; i < total; i++) {
          campaignContracts.push({
            address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER as `0x${string}`,
            abi: CAMPAIGN_MANAGER_ABI,
            functionName: 'getCampaign',
            args: [BigInt(i)],
          });
          
          activeContracts.push({
            address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER as `0x${string}`,
            abi: CAMPAIGN_MANAGER_ABI,
            functionName: 'isCampaignActive',
            args: [BigInt(i)],
          });
        }

        // Fetch all campaign data at once
        const campaignResults = await Promise.all(
          campaignContracts.map((contract, index) =>
            fetch(process.env.NEXT_PUBLIC_MONAD_RPC_URL || 'https://testnet-rpc.monad.xyz', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: index + 1,
                method: 'eth_call',
                params: [
                  {
                    to: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
                    data: encodeCampaignCall(index),
                  },
                  'latest',
                ],
              }),
            }).then(r => r.json())
          )
        );

        console.log('📡 Raw campaign data from blockchain:', campaignResults);

        // Parse campaigns
        const parsedCampaigns: Campaign[] = campaignResults.map((result, index) => {
          if (result.error) {
            console.error(`Error fetching campaign ${index}:`, result.error);
            return null;
          }

          const data = result.result;
          const campaign = decodeCampaignData(data, index);
          
          console.log(`✅ Campaign ${index}:`, {
            company: campaign.company,
            price: campaign.priceFormatted,
            budget: campaign.budgetFormatted,
            cid: campaign.metadataFilecoinCID,
          });

          return campaign;
        }).filter(c => c !== null) as Campaign[];

        setCampaigns(parsedCampaigns);
      } catch (error) {
        console.error('❌ Error fetching campaigns:', error);
      } finally {
        setIsLoadingCampaigns(false);
      }
    }

    fetchAllCampaigns();
  }, [totalCampaigns, isError, isLoading]);

  return {
    campaigns,
    isLoading: isLoading || isLoadingCampaigns,
    isError,
    refetch,
    totalCount: Number(totalCampaigns || 0),
  };
}

// Encode getCampaign(uint256) function call
function encodeCampaignCall(campaignId: number): string {
  const functionSelector = '0x58cf6f25'; // keccak256("getCampaign(uint256)")[:8]
  const encodedId = campaignId.toString(16).padStart(64, '0');
  return functionSelector + encodedId;
}

// Decode campaign data from contract response
function decodeCampaignData(hexData: string, campaignId: number): Campaign {
  // Remove 0x prefix
  const data = hexData.slice(2);
  
  // ABI decode the tuple response
  // Campaign struct: (address company, string metadataFilecoinCID, bytes32 metadataHash, 
  //                   uint256 pricePerSubmission, uint256 totalBudget, uint256 deadline,
  //                   uint256 collectionDuration, uint256 submissionCount, bool active, bytes32 constraintsHash)
  
  let offset = 0;
  
  // Read address (20 bytes, padded to 32)
  const company = '0x' + data.slice(offset + 24, offset + 64);
  offset += 64;
  
  // Skip to dynamic data offset for string (metadataFilecoinCID)
  const cidOffset = parseInt(data.slice(offset, offset + 64), 16) * 2;
  offset += 64;
  
  // metadataHash (bytes32)
  const metadataHash = '0x' + data.slice(offset, offset + 64);
  offset += 64;
  
  // pricePerSubmission (uint256)
  const pricePerSubmission = BigInt('0x' + data.slice(offset, offset + 64));
  offset += 64;
  
  // totalBudget (uint256)
  const totalBudget = BigInt('0x' + data.slice(offset, offset + 64));
  offset += 64;
  
  // deadline (uint256)
  const deadline = BigInt('0x' + data.slice(offset, offset + 64));
  offset += 64;
  
  // collectionDuration (uint256)
  const collectionDuration = BigInt('0x' + data.slice(offset, offset + 64));
  offset += 64;
  
  // submissionCount (uint256)
  const submissionCount = BigInt('0x' + data.slice(offset, offset + 64));
  offset += 64;
  
  // active (bool)
  const active = data.slice(offset + 63, offset + 64) === '1';
  offset += 64;
  
  // constraintsHash (bytes32)
  const constraintsHash = '0x' + data.slice(offset, offset + 64);
  
  // Decode string (metadataFilecoinCID)
  const cidLength = parseInt(data.slice(cidOffset, cidOffset + 64), 16) * 2;
  const cidHex = data.slice(cidOffset + 64, cidOffset + 64 + cidLength);
  const metadataFilecoinCID = hexToString(cidHex);
  
  // Calculate derived fields
  const now = Math.floor(Date.now() / 1000);
  const deadlineNumber = Number(deadline);
  const daysUntilDeadline = (deadlineNumber - now) / (24 * 60 * 60);
  
  let status: 'active' | 'closing' | 'filled' = 'active';
  if (!active) {
    status = 'filled';
  } else if (daysUntilDeadline < 7) {
    status = 'closing';
  }
  
  // Calculate budget used percentage
  const budgetUsed = totalBudget > BigInt(0)
    ? Math.floor((Number(submissionCount) * Number(pricePerSubmission) * 100) / Number(totalBudget))
    : 0;
  
  return {
    id: campaignId,
    company,
    metadataFilecoinCID,
    metadataHash,
    pricePerSubmission,
    totalBudget,
    deadline,
    collectionDuration,
    submissionCount,
    active,
    constraintsHash,
    status,
    budgetUsed: Math.min(budgetUsed, 100),
    priceFormatted: formatEther(pricePerSubmission),
    budgetFormatted: formatEther(totalBudget),
    deadlineDate: new Date(deadlineNumber * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    title: undefined,
    description: undefined,
    attributes: [],
    companyName: undefined,
  };
}

// Convert hex string to UTF-8 string
function hexToString(hex: string): string {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    if (charCode === 0) break; // Stop at null terminator
    str += String.fromCharCode(charCode);
  }
  return str;
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
    if (data && !isError) {
      // Convert data to Campaign type
      const campaignData = data as any;
      
      const now = Math.floor(Date.now() / 1000);
      const deadlineNumber = Number(campaignData.deadline);
      const daysUntilDeadline = (deadlineNumber - now) / (24 * 60 * 60);
      
      let status: 'active' | 'closing' | 'filled' = 'active';
      if (!campaignData.active) {
        status = 'filled';
      } else if (daysUntilDeadline < 7) {
        status = 'closing';
      }
      
      const budgetUsed = campaignData.totalBudget > BigInt(0)
        ? Math.floor((Number(campaignData.submissionCount) * Number(campaignData.pricePerSubmission) * 100) / Number(campaignData.totalBudget))
        : 0;

      setCampaign({
        id: campaignId,
        company: campaignData.company,
        metadataFilecoinCID: campaignData.metadataFilecoinCID,
        metadataHash: campaignData.metadataHash,
        pricePerSubmission: campaignData.pricePerSubmission,
        totalBudget: campaignData.totalBudget,
        deadline: campaignData.deadline,
        collectionDuration: campaignData.collectionDuration,
        submissionCount: campaignData.submissionCount,
        active: campaignData.active,
        constraintsHash: campaignData.constraintsHash,
        status,
        budgetUsed: Math.min(budgetUsed, 100),
        priceFormatted: formatEther(campaignData.pricePerSubmission),
        budgetFormatted: formatEther(campaignData.totalBudget),
        deadlineDate: new Date(deadlineNumber * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      });
      setIsLoading(false);
    }
  }, [data, isError, campaignId]);

  return { campaign, isLoading, isError };
}
