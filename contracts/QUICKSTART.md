# MonadBlitz Quick Start Guide

Get MonadBlitz running in under 10 minutes.

## ⚡ Prerequisites Check

```bash
# Verify Foundry installed
forge --version

# Should output: forge 1.5.1-stable or later
```

## 🚀 Step 1: Project Setup

```bash
# Clone repository
git clone <your-repo-url>
cd MonadBlitz

# Verify installation
forge build

# Should output: Compiler run successful!
```

## ✅ Step 2: Run Tests

```bash
# Run all tests
forge test

# Expected output: 33 tests passed
```

## 🔧 Step 3: Configure Environment

```bash
# Create environment file
cp .env.example .env

# Edit with your details
nano .env
```

Add your values:
```env
# Monad Mainnet (Chain ID: 143)
MONAD_RPC_URL=https://rpc.monad.xyz
# Alternatives: rpc1.monad.xyz, rpc2.monad.xyz, rpc3.monad.xyz

PRIVATE_KEY=0x...
FEE_RECIPIENT=0x...
```

**Get MON tokens:**
- Ensure your deployer address has sufficient MON for gas
- Minimum recommended: 1 MON for deployment + testing

## 🌐 Step 4: Deploy to Monad

### Monad Mainnet (Production)

**Network Info:**
- Chain ID: 143
- Block Time: 400ms
- Finality: 800ms
- Throughput: 10,000 TPS

```bash
# Deploy to Monad mainnet
forge script script/Deploy.s.sol:DeployMonadBlitz \
    --rpc-url monad \
    --broadcast \
    --verify
```

**Gas Costs:**
- Total deployment: ~4.3M gas
- At 100 MON-gwei: ~0.0043 MON (~$2-5 USD)
- Per submission: ~287K gas (~$0.01-0.05 USD)

## 📋 Step 5: Verify Deployment

After deployment, check the output:

```
========================================
DEPLOYMENT SUMMARY - MONAD NETWORK
========================================
Identity Verifier:      0x...
Data Verifier:          0x...
IdentityNFT:            0x...
IdentityRegistry:       0x...
Escrow:                 0x...
CampaignManager:        0x...
SubmissionVerifier:     0x...
========================================
```

Addresses saved to: `deployments/monad-latest.json`

## 🎯 Step 6: Test the Flow

### 6.1 Register an Identity

```bash
# Using the interact script
forge script script/Interact.s.sol \
    --sig "checkIdentity(address,address)" \
    <IDENTITY_REGISTRY_ADDRESS> \
    <USER_ADDRESS> \
    --rpc-url monad
```

### 6.2 Create a Campaign

```solidity
// From your frontend or using cast
cast send <CAMPAIGN_MANAGER_ADDRESS> \
    "createCampaign(string,uint256,uint256,uint256,bytes32)" \
    "QmIPFSHash" \
    "1000000000000000000" \
    30 \
    $(($(date +%s) + 2592000)) \
    "0x..." \
    --value 10ether \
    --rpc-url monad \
    --private-key $PRIVATE_KEY
```

### 6.3 Submit Data

Use the frontend integration or interact script.

## 📊 Common Commands

### Check Contract State

```bash
# Check if user has identity
cast call <IDENTITY_REGISTRY> "hasVerifiedIdentity(address)" <USER_ADDRESS> --rpc-url monad

# Get campaign details
cast call <CAMPAIGN_MANAGER> "getCampaign(uint256)" 1 --rpc-url monad

# Check escrow balance
cast call <ESCROW> "getRemainingBudget(uint256)" 1 --rpc-url monad
```

### Monitor Events

```bash
# Watch for new identities
cast logs --address <IDENTITY_REGISTRY> --rpc-url monad

# Watch for campaigns
cast logs --address <CAMPAIGN_MANAGER> --rpc-url monad

# Watch for submissions
cast logs --address <SUBMISSION_VERIFIER> --rpc-url monad
```

## 🔍 Debugging

### Build Fails

```bash
# Clean and rebuild
forge clean
forge build
```

### Test Fails

```bash
# Run with verbose output
forge test -vvvv

# Run specific test
forge test --match-test testRegisterIdentity -vvv
```

### Deployment Fails

Check:
1. Sufficient MON for gas
2. Correct RPC URL
3. Valid private key
4. Network connectivity

```bash
# Check balance
cast balance <YOUR_ADDRESS> --rpc-url monad

# Check gas price
cast gas-price --rpc-url monad
```

## 📱 Frontend Integration Example

```javascript
import { ethers } from 'ethers';
import deployments from './deployments/monad-latest.json';
import IdentityRegi (Chain ID: 143)
const MONAD_RPC = 'https://rpc.monad.xyz';
const MONAD_CHAIN_ID = 143;

const provider = new ethers.JsonRpcProvider(MONAD_RPC);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Verify network
const network = await provider.getNetwork();
console.log('Connected to Monad:', network.chainId === 143n);

// Get contracts
const identityRegistry = new ethers.Contract(
    deployments.contracts.IdentityRegistry,
    IdentityRegistryABI,
    signer
);

// Register identity
async function registerIdentity(proof, nullifier, publicSignals) {
    const tx = await identityRegistry.registerIdentity(
        proof,
        nullifier,
        publicSignals
    );
    
    // Wait for 1 block (800ms finality)
    const receipt = await tx.wait(1);
    console.log('Identity registered! Finalized in ~800ms');
    return receipt;
}

// Check identity
async function checkIdentity(address) {
    const hasIdentity = await identityRegistry.hasVerifiedIdentity(address);
    console.log('Has identity:', hasIdentity);
    return hasIdentity;
}

// Monitor submissions in real-time
provider.on('block', async (blockNumber) => {
    console.log(`New block: ${blockNumber} (every 400ms)`);
})**Monad Performance**: Leverage 400ms blocks for real-time UX
- **Gas Pricing**: Be aware of Monad's different opcode pricing
- **Parallel Execution**: Independent submissions execute concurrently
- **Finality**: 800ms finality (2 blocks) for guaranteed settlement
- **Reserve Balance**: Accounts need 10 MON reserve for async execution
- Keep private keys secure (never commit!)
- Monitor gas prices on Monad
- Use events for off-chain indexing
- Replace MockVerifier in production with real Groth16 verifiers

**Monad-Specific:**
- Use `monad-foundry` fork for accurate gas estimates
- Check [MonadVision](https://monadvision.com) for transaction traces
- Join [Monad Developer Discord](https://discord.gg/monaddev) for support
  chainId: '0x8F', // 143 in hex
  chainName: 'Monad Mainnet',
  nativeCurrency: {on Monad and ready for:
- ✅ User identity registration (ZK-verified uniqueness)
- ✅ Company campaign creation (privacy-preserving constraints)
- ✅ Privacy-preserving data submissions (dual ZK proofs)
- ✅ Automated escrow payments (sub-second settlement)

**Monad Advantages You're Using:**
- 🚀 **10,000 TPS** - Handle massive scale
- ⚡ **400ms blocks** - Near-instant confirmations
- 💰 **Low costs** - Micro-transactions viable
- 🔄 **Parallel execution** - Concurrent verifications
- ✅ **800ms finality** - Fast, irreversible settlement

Happy building on Monad! 🚀

**Resources:**
- [Why Monad?](MONAD_USES.md) - Detailed rationale
- [Monad Docs](https://docs.monad.xyz/) - Official documentation
- [Architecture](ARCHITECTURE.md) - System design
- [Deployment Guide](DEPLOYMENT_MONAD.md) - Advanced deployments: ['https://monadvision.com'] await identityRegistry.hasVerifiedIdentity(address);
    console.log('Has identity:', hasIdentity);
    return hasIdentity;
}
```

## 🎓 Next Steps

1. **Read Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Setup ZK Circuits**: See [circuits/README.md](circuits/README.md)
3. **Deploy to Production**: See [DEPLOYMENT_MONAD.md](DEPLOYMENT_MONAD.md)
4. **Build Frontend**: Integrate with your dApp
5. **Monitor Contracts**: Set up event listeners

## 💡 Tips

- Start with testnet before mainnet
- Test all flows before deploying
- Keep private keys secure (never commit!)
- Monitor gas prices on Monad
- Use events for off-chain indexing
- Replace MockVerifier in production

## 🆘 Need Help?

- **Documentation**: Read README.md and ARCHITECTURE.md
- **Issues**: Open a GitHub issue
- **Monad Support**: Check Monad Discord
- **Tests**: Run `forge test -vvvv` for details

## 🎉 You're Ready!

Your MonadBlitz marketplace is now deployed and ready for:
- ✅ User identity registration
- ✅ Company campaign creation
- ✅ Privacy-preserving data submissions
- ✅ Automated escrow payments

Happy building! 🚀
