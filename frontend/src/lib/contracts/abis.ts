/**
 * ABI for the CampaignManager contract
 * Derived from contracts/src/CampaignManager.sol
 */
export const CAMPAIGN_MANAGER_ABI = [
  {
    type: 'function',
    name: 'createCampaign',
    inputs: [
      { name: 'metadataFilecoinCID', type: 'string' },
      { name: 'metadataHash',        type: 'bytes32' },
      { name: 'pricePerSubmission',   type: 'uint256' },
      { name: 'collectionDuration',   type: 'uint256' },
      { name: 'deadline',             type: 'uint256' },
      { name: 'constraintsHash',      type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getCampaign',
    inputs: [{ name: 'campaignId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'company',             type: 'address' },
          { name: 'metadataFilecoinCID', type: 'string'  },
          { name: 'metadataHash',        type: 'bytes32' },
          { name: 'pricePerSubmission',  type: 'uint256' },
          { name: 'totalBudget',         type: 'uint256' },
          { name: 'deadline',            type: 'uint256' },
          { name: 'collectionDuration',  type: 'uint256' },
          { name: 'submissionCount',     type: 'uint256' },
          { name: 'active',             type: 'bool'    },
          { name: 'constraintsHash',    type: 'bytes32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isCampaignActive',
    inputs: [{ name: 'campaignId', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTotalCampaigns',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'incrementSubmissionCount',
    inputs: [{ name: 'campaignId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deactivateCampaign',
    inputs: [{ name: 'campaignId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'CampaignCreated',
    inputs: [
      { name: 'campaignId',        type: 'uint256', indexed: true  },
      { name: 'company',           type: 'address', indexed: true  },
      { name: 'pricePerSubmission', type: 'uint256', indexed: false },
      { name: 'totalBudget',       type: 'uint256', indexed: false },
      { name: 'deadline',          type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'CampaignDeactivated',
    inputs: [
      { name: 'campaignId', type: 'uint256', indexed: true },
    ],
  },
] as const;

/**
 * ABI for the IdentityRegistry contract
 * Derived from contracts/src/IdentityRegistry.sol
 */
export const IDENTITY_REGISTRY_ABI = [
  {
    type: 'function',
    name: 'registerIdentity',
    inputs: [
      { name: 'proof',         type: 'uint256[8]' },
      { name: 'nullifier',     type: 'bytes32'     },
      { name: 'publicSignals', type: 'uint256[]'   },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'hasVerifiedIdentity',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isNullifierUsed',
    inputs: [{ name: 'nullifier', type: 'bytes32' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isRegistered',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserIdentityTokenId',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'IdentityRegistered',
    inputs: [
      { name: 'user',      type: 'address', indexed: true  },
      { name: 'nullifier', type: 'bytes32', indexed: true  },
      { name: 'tokenId',   type: 'uint256', indexed: false },
    ],
  },
] as const;
