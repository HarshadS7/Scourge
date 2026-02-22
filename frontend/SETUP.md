# Frontend Setup Guide - Scourge

Complete guide for setting up the frontend with MetaMask wallet connection and Filecoin integration.

## 📋 Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Web3.Storage account (free at https://web3.storage)
- Deployed smart contracts on Monad testnet

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- ✅ Next.js, React, TypeScript
- ✅ ethers.js (Web3 library)
- ✅ wagmi + RainbowKit (Wallet connection)
- ✅ Web3.Storage (Filecoin/IPFS)
- ✅ Tailwind CSS

### 2. Configure Environment Variables

#### 2.1 Create `.env.local` file

```bash
cp .env.example .env.local
```

#### 2.2 Get Web3.Storage API Token

1. Go to https://web3.storage
2. Click "Sign in" (free account)
3. Navigate to "Account" → "Create API Token"
4. Copy your token
5. Add to `.env.local`:

```bash
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_TOKEN_HERE
```

#### 2.3 Get WalletConnect Project ID (Optional but recommended)

1. Go to https://cloud.walletconnect.com
2. Create a free account
3. Create a new project
4. Copy your Project ID
5. Add to `.env.local`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

#### 2.4 Add Contract Addresses

After deploying your contracts to Monad, add the addresses:

```bash
NEXT_PUBLIC_IDENTITY_NFT_ADDRESS=0x...
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_SUBMISSION_VERIFIER_ADDRESS=0x...
NEXT_PUBLIC_GROTH16_VERIFIER_ADDRESS=0x...
```

**Complete `.env.local` example:**

```bash
# Blockchain
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_CHAIN_ID=41454

# Contracts (update after deployment)
NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_SUBMISSION_VERIFIER_ADDRESS=0x2345678901234567890123456789012345678901

# Filecoin
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_TOKEN
NEXT_PUBLIC_IPFS_GATEWAY=https://w3s.link/ipfs

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

---

## 🔗 MetaMask Setup

### 1. Add Monad Testnet to MetaMask

#### Option A: Automatic (Recommended)

Add this button to your app:

```typescript
'use client';

import { useAddNetwork } from 'wagmi';
import { monadTestnet } from '@/lib/wagmi';

export function AddNetworkButton() {
  const { addChain } = useAddNetwork();

  return (
    <button
      onClick={() => addChain({ chain: monadTestnet })}
      className="bg-purple-600 px-4 py-2 rounded"
    >
      Add Monad Testnet to MetaMask
    </button>
  );
}
```

#### Option B: Manual Setup

1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter these details:

```
Network Name: Monad Testnet
RPC URL: https://testnet-rpc.monad.xyz
Chain ID: 41454
Currency Symbol: MONAD
Block Explorer: https://testnet-explorer.monad.xyz
```

### 2. Get Testnet MONAD Tokens

1. Visit Monad testnet faucet: `https://faucet.monad.xyz`
2. Enter your wallet address
3. Request tokens (usually get 1-10 MONAD)
4. Wait ~30 seconds for tokens to arrive

---

## 🎨 Integrate into Your App

### 1. Update Root Layout

Edit `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Web3Provider } from '@/lib/Web3Provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scourge - Privacy-First Data Marketplace',
  description: 'Decentralized data marketplace with zero-knowledge proofs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
```

### 2. Add Wallet Connect to Page

Edit `src/app/page.tsx`:

```typescript
'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { CreateCampaignExample } from '@/components/CampaignExamples';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Scourge</h1>
          <p className="text-gray-400">Privacy-First Data Marketplace</p>
        </header>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {/* Campaign Creation */}
        <CreateCampaignExample />
      </div>
    </main>
  );
}
```

---

## 📝 Usage Examples

### Creating a Campaign

```typescript
import { uploadToFilecoin } from '@/lib/filecoin';
import { useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { CAMPAIGN_MANAGER_ABI } from '@/lib/contracts/abis';
import { parseEther } from 'viem';

function CreateCampaign() {
  const { writeContract } = useWriteContract();

  const handleCreate = async () => {
    // 1. Prepare metadata
    const metadata = {
      title: 'User Survey',
      description: 'Tell us about your shopping habits',
      formFields: [
        { id: 'age', type: 'number', label: 'Age' },
      ],
    };

    // 2. Upload to Filecoin
    const { cid, hash } = await uploadToFilecoin(metadata);

    // 3. Create on-chain
    writeContract({
      address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
      abi: CAMPAIGN_MANAGER_ABI,
      functionName: 'createCampaign',
      args: [
        cid,                           // Filecoin CID
        hash,                          // Metadata hash
        parseEther('100'),             // 100 MONAD per submission
        BigInt(30),                    // 30 days duration
        BigInt(Date.now()/1000 + 2592000), // Deadline
        '0x' + '0'.repeat(64),         // Constraints hash
      ],
      value: parseEther('10000'),      // Total budget
    });
  };

  return <button onClick={handleCreate}>Create Campaign</button>;
}
```

### Reading Campaign Data

```typescript
import { useReadContract } from 'wagmi';
import { fetchFromFilecoin } from '@/lib/filecoin';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { CAMPAIGN_MANAGER_ABI } from '@/lib/contracts/abis';

function CampaignDetails({ campaignId }: { campaignId: bigint }) {
  // 1. Read from blockchain
  const { data: campaign } = useReadContract({
    address: CONTRACT_ADDRESSES.CAMPAIGN_MANAGER,
    abi: CAMPAIGN_MANAGER_ABI,
    functionName: 'getCampaign',
    args: [campaignId],
  });

  // 2. Fetch from Filecoin
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (campaign) {
      fetchFromFilecoin(
        campaign[1],  // metadataFilecoinCID
        true,         // verify hash
        campaign[2]   // metadataHash
      ).then(setMetadata);
    }
  }, [campaign]);

  return (
    <div>
      <h3>{metadata?.title}</h3>
      <p>{metadata?.description}</p>
    </div>
  );
}
```

### Uploading Files to Filecoin

```typescript
import { uploadFileToFilecoin } from '@/lib/filecoin';

function FileUpload() {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { cid, name, size, type } = await uploadFileToFilecoin(file);
    
    console.log('Uploaded:', { cid, name, size, type });
    // Use CID in submission...
  };

  return <input type="file" onChange={handleUpload} />;
}
```

---

## 🧪 Testing

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Test Checklist

- [ ] MetaMask connects successfully
- [ ] Network switches to Monad Testnet
- [ ] Balance displays correctly
- [ ] Can upload test data to Filecoin
- [ ] Can create a test campaign (if contracts deployed)
- [ ] Can read campaign data
- [ ] Data integrity verification works

---

## 🔍 Troubleshooting

### "Web3.Storage token not found"

**Solution:** Make sure you added the token to `.env.local`:

```bash
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token_here
```

Restart the dev server after adding.

### "Wrong Network" in MetaMask

**Solution:** 

1. Click "Switch Network" button
2. Or manually switch to Monad Testnet in MetaMask

### "Contract not deployed" errors

**Solution:**

1. Deploy contracts first: `cd contracts && forge script script/Deploy.s.sol --rpc-url $MONAD_RPC_URL --broadcast`
2. Copy deployed addresses to frontend `.env.local`

### Filecoin upload fails

**Solutions:**

1. Check your Web3.Storage token is valid
2. Check file size (max 100MB per file on free tier)
3. Check internet connection
4. Try again (sometimes network issues)

### TypeScript errors

**Solution:**

```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

---

## 📚 Additional Resources

### Documentation

- **RainbowKit Docs**: https://www.rainbowkit.com/docs
- **wagmi Docs**: https://wagmi.sh
- **Web3.Storage Docs**: https://web3.storage/docs
- **Viem Docs**: https://viem.sh

### Example Code

All examples are in:
- `src/components/WalletConnect.tsx` - Wallet connection
- `src/components/CampaignExamples.tsx` - Contract interaction
- `src/lib/filecoin.ts` - Filecoin utilities
- `src/lib/wagmi.ts` - Wallet configuration

### Getting Help

1. Check error messages in browser console
2. Check MetaMask for transaction details
3. Verify environment variables are set correctly
4. Check Monad testnet explorer for transactions

---

## 🎉 You're Ready!

Your frontend is now set up with:

✅ MetaMask wallet connection  
✅ Monad testnet support  
✅ Filecoin/IPFS storage  
✅ Smart contract integration  
✅ TypeScript type safety  
✅ Example components  

**Next Steps:**

1. Deploy your smart contracts to Monad
2. Add contract addresses to `.env.local`
3. Build your custom UI
4. Test with real campaigns
5. Launch! 🚀
