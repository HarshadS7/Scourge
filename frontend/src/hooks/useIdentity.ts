/**
 * useIdentity Hook - Check user identity status and manage soul-bound NFT
 */

import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { IDENTITY_REGISTRY_ABI } from '@/lib/contracts/abis';

export function useIdentity() {
  const { address, isConnected } = useAccount();

  // Check if user has a registered identity
  const { data: hasIdentity, isLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: 'hasVerifiedIdentity',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Get user's identity token ID
  const { data: identityId } = useReadContract({
    address: CONTRACT_ADDRESSES.IDENTITY_REGISTRY,
    abi: IDENTITY_REGISTRY_ABI,
    functionName: 'getUserIdentityTokenId',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected && !!hasIdentity,
    },
  });

  return {
    hasIdentity: !!hasIdentity,
    identityId: identityId as bigint | undefined,
    isLoading,
    address,
    isConnected,
  };
}
