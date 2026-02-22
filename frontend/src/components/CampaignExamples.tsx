'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { CAMPAIGN_MANAGER_ABI } from '@/lib/contracts/abis';
import { uploadToFilecoin } from '@/lib/filecoin';

/**
 * Campaign Creation Component
 * Example of how to create a campaign with Filecoin integration
 */
export function CreateCampaignExample() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerSubmission: '',
    budget: '',
    durationDays: '30',
  });

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Prepare campaign metadata
      const campaignMetadata = {
        version: '1.0',
        title: formData.title,
        description: formData.description,
        requirements: {
          formFields: [
            {
              id: 'example_field',
              label: 'Example Field',
              type: 'text',
              required: true,
            },
          ],
        },
        companyInfo: {
          address: address,
        },
        timestamp: Date.now(),
      };

      // 2. Upload to Filecoin
      console.log('Uploading campaign metadata to Filecoin...');
      const { cid, hash: metadataHash } = await uploadToFilecoin(campaignMetadata, 'campaign.json');
      console.log('✅ Uploaded:', cid);

      // 3. Create campaign on-chain
      const deadline = Math.floor(Date.now() / 1000) + (parseInt(formData.durationDays) * 24 * 60 * 60);
      const constraintsHash = '0x' + '0'.repeat(64); // Placeholder - replace with actual ZK constraints hash

      writeContract({
        address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
        abi: CAMPAIGN_MANAGER_ABI,
        functionName: 'createCampaign',
        args: [
          cid,
          metadataHash as `0x${string}`,
          parseEther(formData.pricePerSubmission),
          BigInt(formData.durationDays),
          BigInt(deadline),
          constraintsHash as `0x${string}`,
        ],
        value: parseEther(formData.budget),
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Create Campaign</h2>

      <form onSubmit={handleCreateCampaign} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Campaign Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            placeholder="E.g., User Shopping Habits Survey"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-700 rounded px-4 py-2 text-white min-h-[100px]"
            placeholder="Describe what data you're looking for..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price per Submission (MONAD)</label>
            <input
              type="number"
              step="0.01"
              value={formData.pricePerSubmission}
              onChange={(e) => setFormData({ ...formData, pricePerSubmission: e.target.value })}
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
              placeholder="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Budget (MONAD)</label>
            <input
              type="number"
              step="0.01"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
              placeholder="10000"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration (Days)</label>
          <input
            type="number"
            value={formData.durationDays}
            onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            placeholder="30"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !address}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          {isPending ? 'Uploading to Filecoin...' : isConfirming ? 'Creating Campaign...' : 'Create Campaign'}
        </button>

        {isSuccess && (
          <div className="bg-green-600/20 border border-green-600 rounded-lg p-4">
            <p className="text-green-400 font-medium">✅ Campaign created successfully!</p>
            <p className="text-sm text-gray-300 mt-1">Transaction hash: {hash}</p>
          </div>
        )}
      </form>
    </div>
  );
}

/**
 * Campaign List Component
 * Example of how to read campaign data
 */
export function CampaignListExample() {
  const { data: totalCampaigns } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'getTotalCampaigns',
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Active Campaigns</h2>
      
      <p className="text-gray-400">
        Total Campaigns: {totalCampaigns ? totalCampaigns.toString() : 'Loading...'}
      </p>

      {/* Add campaign list rendering here */}
      <div className="mt-4 space-y-4">
        {/* This would map over campaigns */}
        <p className="text-sm text-gray-500">Campaign list will be displayed here</p>
      </div>
    </div>
  );
}

/**
 * Single Campaign Component
 * Shows how to fetch campaign details from blockchain and Filecoin
 */
export function CampaignDetailsExample({ campaignId }: { campaignId: bigint }) {
  const { data: campaign, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'getCampaign',
    args: [campaignId],
  });

  const { data: isActive } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'isCampaignActive',
    args: [campaignId],
  });

  if (isLoading) {
    return <div className="text-gray-400">Loading campaign...</div>;
  }

  if (!campaign) {
    return <div className="text-red-400">Campaign not found</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Campaign #{campaignId.toString()}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Company:</span>
          <code className="text-xs bg-gray-900 px-2 py-1 rounded">
            {campaign[0].slice(0, 6)}...{campaign[0].slice(-4)}
          </code>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Filecoin CID:</span>
          <code className="text-xs bg-gray-900 px-2 py-1 rounded">
            {campaign[1].slice(0, 10)}...
          </code>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Price per Submission:</span>
          <span className="font-mono">{formatEther(campaign[3])} MONAD</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Total Budget:</span>
          <span className="font-mono">{formatEther(campaign[4])} MONAD</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Submissions:</span>
          <span>{campaign[7].toString()}</span>
        </div>
      </div>

      {/* Fetch and display metadata from Filecoin would go here */}
    </div>
  );
}
