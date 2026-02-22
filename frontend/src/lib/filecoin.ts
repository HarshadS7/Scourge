import { keccak256, toBytes } from 'viem';

/**
 * Upload data to Filecoin / IPFS via web3.storage or similar gateway.
 * Returns the CID and a keccak256 hash of the content for on-chain integrity checks.
 *
 * NOTE: Replace the placeholder implementation with your actual
 * web3.storage / Lighthouse / Pinata upload logic.
 */
export async function uploadToFilecoin(
  data: unknown,
  filename: string,
): Promise<{ cid: string; hash: `0x${string}` }> {
  const jsonString = JSON.stringify(data);
  const contentHash = keccak256(toBytes(jsonString));

  // ── Placeholder: replace with real upload ──
  // Example with web3.storage:
  //   const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN! });
  //   const file = new File([jsonString], filename, { type: 'application/json' });
  //   const cid = await client.put([file]);
  //   return { cid, hash: contentHash };

  // For now, return a deterministic mock CID so the build passes
  const mockCid = `bafybeig${contentHash.slice(2, 50)}`;
  console.warn('[filecoin] Using mock upload — replace with real implementation');
  return { cid: mockCid, hash: contentHash };
}
