# Environment Variables Quick Reference

## 🚀 Quick Setup

### 1. Frontend (.env.local)

```bash
# Copy this into frontend/.env.local

# === REQUIRED ===
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_TOKEN_HERE
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# === CONTRACT ADDRESSES (after deployment) ===
NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_SUBMISSION_VERIFIER_ADDRESS=0x...
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_IDENTITY_NFT_ADDRESS=0x...
NEXT_PUBLIC_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_GROTH16_VERIFIER_ADDRESS=0x...

# === MONAD NETWORK ===
NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz
NEXT_PUBLIC_CHAIN_ID=41454
NEXT_PUBLIC_EXPLORER_URL=https://testnet-explorer.monad.xyz

# === IPFS/FILECOIN ===
NEXT_PUBLIC_IPFS_GATEWAY=https://w3s.link/ipfs
```

### 2. Contracts (.env)

```bash
# Copy this into contracts/.env

# === REQUIRED ===
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
MONAD_RPC_URL=https://testnet-rpc.monad.xyz

# === OPTIONAL ===
FEE_RECIPIENT=0x...
MONAD_EXPLORER_API_KEY=your_api_key
```

---

## 📝 How to Get Each Variable

### Web3.Storage Token

1. Visit: https://web3.storage
2. Sign in (free account)
3. Go to "Account" → "Create API Token"
4. Copy token
5. Paste into `NEXT_PUBLIC_WEB3_STORAGE_TOKEN`

**Free Tier Limits:**
- ✅ Unlimited uploads
- ✅ Up to 1GB per upload
- ✅ Permanent storage

### WalletConnect Project ID

1. Visit: https://cloud.walletconnect.com
2. Create free account
3. Click "Create Project"
4. Copy "Project ID"
5. Paste into `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

**Why needed?** Enables WalletConnect, Coinbase Wallet, and other non-MetaMask wallets.

### Contract Addresses

After deploying contracts:

```bash
cd contracts
forge script script/Deploy.s.sol --rpc-url $MONAD_RPC_URL --broadcast --verify
```

Copy addresses from deployment output:

```
✅ Deployed IdentityNFT: 0x1234...
✅ Deployed IdentityRegistry: 0x2345...
✅ Deployed CampaignManager: 0x3456...
✅ Deployed Escrow: 0x4567...
✅ Deployed SubmissionVerifier: 0x5678...
✅ Deployed MockGroth16Verifier: 0x6789...
```

### Private Key (Contracts only)

**Option A: Export from MetaMask**

1. Open MetaMask
2. Click account menu → "Account details"
3. Click "Export Private Key"
4. Enter password
5. Copy key (starts with 0x)

**⚠️ SECURITY WARNING:**
- NEVER share your private key
- NEVER commit `.env` file to git
- Use a TESTNET wallet, not mainnet
- Create a dedicated deployment wallet

**Option B: Create new wallet**

```bash
cast wallet new
```

---

## ✅ Validation Checklist

### Frontend

```bash
# Check all required variables are set
cd frontend
cat .env.local | grep -E "WEB3_STORAGE_TOKEN|WALLETCONNECT_PROJECT_ID|CAMPAIGN_MANAGER_ADDRESS"
```

Should see all three variables with values (not empty).

### Contracts

```bash
# Check deployment variables
cd contracts
cat .env | grep -E "PRIVATE_KEY|MONAD_RPC_URL"
```

Should see both variables set.

### Test Filecoin Connection

```javascript
// In browser console on your frontend
fetch('https://web3.storage/', {
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN}`
  }
}).then(r => r.ok ? 'Token valid ✅' : 'Token invalid ❌')
```

---

## 🔒 Security Best Practices

### DO ✅

- Use `.env.local` for frontend (automatically ignored by git)
- Use `.env` for contracts (add to `.gitignore`)
- Use testnet wallets for development
- Rotate tokens if accidentally exposed
- Use environment-specific variables

### DON'T ❌

- Commit `.env` or `.env.local` files
- Share private keys
- Use mainnet wallets for testing
- Hardcode sensitive values in code
- Expose private keys in frontend code

---

## 🎯 Common Issues

### "Token not found" Error

```bash
# Check if variable exists
echo $NEXT_PUBLIC_WEB3_STORAGE_TOKEN

# If empty, check .env.local is in the right folder
ls -la frontend/.env.local

# Restart dev server after adding variables
npm run dev
```

### "Wrong network" in MetaMask

```bash
# Verify chain ID
echo $NEXT_PUBLIC_CHAIN_ID
# Should be: 41454
```

### Contract addresses not working

```bash
# Verify addresses start with 0x and are 42 characters
echo $NEXT_PUBLIC_CAMPAIGN_MANAGER_ADDRESS | wc -c
# Should be: 43 (42 + newline)
```

---

## 📋 Environment Files

```
Scourge/
├── frontend/
│   ├── .env.example      ← Template (committed to git)
│   └── .env.local        ← Your config (NOT committed)
│
└── contracts/
    ├── .env.example      ← Template (committed to git)
    └── .env              ← Your config (NOT committed)
```

---

## 🚦 Quick Start Commands

```bash
# 1. Setup frontend
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
npm install
npm run dev

# 2. Setup contracts
cd ../contracts
cp .env.example .env
# Edit .env with your private key
forge install
forge test

# 3. Deploy contracts
forge script script/Deploy.s.sol --rpc-url $MONAD_RPC_URL --broadcast

# 4. Update frontend with contract addresses
# Copy addresses from deployment output to frontend/.env.local
```

---

## 📞 Need Help?

1. **Frontend issues**: Check [frontend/SETUP.md](../frontend/SETUP.md)
2. **Contract issues**: Check [contracts/README.md](../contracts/README.md)
3. **Filecoin issues**: https://web3.storage/docs
4. **Wallet issues**: https://www.rainbowkit.com/docs/troubleshooting
