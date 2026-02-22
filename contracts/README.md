# MonadBlitz - Privacy-Preserving Data Marketplace

**A trust-minimized, zero-knowledge proof-based data marketplace built on Monad network.**

MonadBlitz enables users to monetize real behavioral and attribute data while maintaining privacy. Companies receive only requested attributes through cryptographic proofs, with no raw PII exposed. All payments are fully automated through smart contracts.

## 🎯 System Objectives

- ✅ Users monetize verified behavioral/attribute data
- ✅ Companies receive only requested attributes (no raw data)
- ✅ Zero PII exposure through ZK proofs
- ✅ Fully automated payments via smart contracts
- ✅ One human = one account (Sybil-resistant)
- ✅ No subjective "usefulness" evaluation

## 🏗️ Architecture

MonadBlitz leverages **Monad's high-performance Layer 1 blockchain** to enable a privacy-preserving data marketplace at scale.

**Why Monad?**
- ⚡ **10,000 TPS** - Handle massive transaction volume
- 🚀 **400ms block time** - Near-instant confirmations
- ✅ **800ms finality** - Fast, irreversible transactions
- 💰 **Low costs** - Economically viable micro-transactions
- 🔄 **Parallel execution** - Perfect for concurrent ZK verifications
- 🔗 **Full EVM compatibility** - Seamless developer experience

See [MONAD_USES.md](MONAD_USES.md) for detailed explanation of why Monad was chosen.

### Core Components

1. **Identity Layer** - ZK-based uniqueness proof with soulbound NFTs
2. **Data Integrity Layer** - Verifiable data sources (no self-reporting)
3. **Zero-Knowledge Proof Layer** - Privacy-preserving constraint proofs
4. **Storage Layer** - Encrypted IPFS with on-chain commitments
5. **Campaign Marketplace** - Trustless data request/fulfillment
6. **Escrow System** - Atomic payment on proof verification

### Smart Contracts

| Contract | Purpose |
|----------|---------|
| `IdentityNFT.sol` | Non-transferable soulbound identity tokens |
| `IdentityRegistry.sol` | ZK identity verification and registration |
| `Escrow.sol` | Campaign fund management and payment release |
| `CampaignManager.sol` | Data collection campaign creation |
| `SubmissionVerifier.sol` | ZK proof verification and payout orchestration |
| `MockGroth16Verifier.sol` | Testing verifier (replace in production) |

### Key Features

#### 🔐 Sybil Resistance
- ZK uniqueness proofs at registration
- Nullifier system prevents duplicate accounts
- Soulbound NFT required for participation

#### 🛡️ Privacy Protection
- Only constraint proofs revealed (not raw data)
- Range, set membership, and threshold proofs
- Encrypted IPFS storage
- No deanonymization through query aggregation

#### ⚡ Trustless Execution
- Atomic escrow release on valid proof
- No manual approval/rejection
- Company cannot refuse payment after seeing valid proof
- Verifiable on-chain audit trail

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) - Already installed ✅
- Monad RPC access (public endpoints available)
- MON tokens for gas

**Monad Network Details:**
- Chain ID: 143
- RPC: https://rpc.monad.xyz
- Explorer: https://monadvision.com

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd MonadBlitz

# Install dependencies (already done)
forge install

# Build contracts
forge build

# Run tests
forge test
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your valuRPC endpoint (e.g., https://rpc.monad.xyz)
- `PRIVATE_KEY` - Deployer private key
- `FEE_RECIPIENT` - Platform fee recipient address
- `MONAD_EXPLORER_API_KEY` - For contract verification (optional)
Required environment variables:
- `MONAD_RPC_URL` - Monad network RPC endpoint
- `PRIVATE_KEY` - Deployer private key
- `FEE_RECIPIENT` - Platform fee recipient address
- `MONAD_EXPLORER_API_KEY` - For contract verification

## 📦 Deployment

### Deploy to Monad

```bash
# Simulate deployment (dry run)
forge script script/Deploy.s.sol:DeployMonadBlitz --rpc-url monad

# Deploy contracts
forge script script/Deploy.s.sol:DeployMonadBlitz \
    --rpc-url monad \
    --broadcast \
    --verify
```

Deployment addresses saved to `deployments/monad-latest.json`

See [DEPLOYMENT_MONAD.md](DEPLOYMENT_MONAD.md) for detailed deployment guide.

## 🧪 Testing

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test file
forge test --match-path test/IdentityRegistry.t.sol

# Gas report
forge test --gas-report

# Coverage
forge coverage
```

**Test Results**: 33 tests, 100% passing ✅

## 📊 Usage Flow

### 1. User Registration

```solidity
// Generate ZK proof of unique identity
// Submit proof to IdentityRegistry
identityRegistry.registerIdentity(proof, nullifier, publicSignals);
// Receive soulbound Identity NFT
```

### 2. Company Creates Campaign

```solidity
// Define required attributes and constraints
// Deposit budget to escrow
campaignManager.createCampaign{value: budget}(
    attributesIPFSHash,
    pricePerSubmission,
    collectionDuration,
    deadline,
    constraintsHash
);
```

### 3. User Submits Data

```solidity
// Collect verified data
// Generate ZK proofs (identity + data constraints)
// Encrypt data and upload to IPFS
// Submit to contract
submissionVerifier.submitData(
    campaignId,
    identityProof,
    dataProof,
    campaignNullifier,
    encryptedDataIPFSHash,
    identityPublicSignals,
    dataPublicSignals
);
// Receive instant payment on valid proof
```

### 4. Automated Verification & Payment

Contract automatically:
1. ✅ Verifies identity proof
2. ✅ Checks nullifier uniqueness
3. ✅ Verifies data constraint proof
4. ✅ Releases escrow payment
5. ✅ Emits event with encrypted data CID

**No human intervention required!**

## 🔬 ZK Circuits

Located in `circuits/`:
- `identityProof.circom` - Proves unique identity
- `campaignSubmissionProof.circom` - Proves data satisfies constraints

### MVP Attributes (Hackathon Version)
- Age range (18-65)
- Region (categorical)
- Behavior metric (transaction count, etc.)

**Production**: Replace with multi-source attestation circuits

See [circuits/README.md](circuits/README.md) for circuit setup.

## 🔒 Security Considerations

### Nullifier Model
```
registrationNullifier = hash(identity_secret)
campaignNullifier = hash(identity_secret + campaign_id)
```

Prevents:
- ❌ Multiple account creation
- ❌ Duplicate campaign submissions
- ❌ Sybil attacks

### Data Integrity
✅ Must come from verifiable sources:
- Bank API logs
- UPI statements
- OAuth connectors
- Device attestation
- Verifiable credentials

❌ No self-reported values accepted

### Anti-Deanonymization
- Query caps per company
- Attribute aggregation thresholds
- Optional differential privacy noise
- Restricted repeated micro-queries

## 📈 Gas Optimization

MonadBlitz leverages Monad's high-performance architecture:
- **Parallel transaction execution** - Independent submissions execute concurrently
- **Optimized proof verification** - JIT compilation for efficient execution
- **Efficient storage patterns** - Minimal on-chain data
- **200M gas per block** - Massive throughput capacity

**Performance Metrics:**
- Theoretical max: **1,742 submissions/sec**
- Practical sustained: **500-1,000 submissions/sec**
- Daily capacity: **43-86 million submissions**

Estimated gas costs (from test suite):
- Identity Registration: ~161K gas
- Campaign Creation: ~333K gas
- Data Submission: ~287K gas

See [MONAD_USES.md](MONAD_USES.md) for detailed performance analysis.

## 🛠️ Development

### Project Structure
```
├── src/                    # Smart contracts
│   ├── IdentityNFT.sol
│   ├── IdentityRegistry.sol
│   ├── Escrow.sol
│   ├── CampaignManager.sol
│   ├── SubmissionVerifier.sol
│   └── interfaces/
├── test/                   # Foundry tests
├── script/                 # Deployment scripts
├── circuits/               # ZK circuits (Circom)
├── lib/                    # Dependencies
└── deployments/            # Deployment artifacts
```

### Key Commands

```bash
# Build
forge build

# Test
forge test

# Format
forge fmt

# Coverage
forge coverage

# Deploy
forge script script/Deploy.s.sol --rpc-url monad --broadcast

# Interact
forge script script/Interact.s.sol --sig "checkIdentity(address,address)" \
    <registry_address> <user_address> --rpc-url monad
```

## 🌐 Integration

### Frontend Integration

```javascript
// Connect to deployed contracts
const identityRegistry = new ethers.Contract(
    addresses.IdentityRegistry,
    IdentityRegistryABI,
    signer
);

// Register identity
await identityRegistry.registerIdentity(
    proof,
    nullifier,
    publicSignals
);

// Check identity
const hasIdentity = await identityRegistry.hasVerifiedIdentity(userAddress);
```

### Backend Integration

Handle:
- ZK proof generation (circom/snarkjs)
- Data encryption (AES-256-GCM)
- IPFS uploads (encrypted blobs)
- Event monitoring (submission verification)

## 📜 License

MIT License - See LICENSE file

## 🤝 Contributing
Why Monad for MonadBlitz](MONAD_USES.md)
- [Monad Network Info](https://docs.monad.xyz/developer-essentials/network-information)
- [Monad Developer Discord](https://discord.gg/monaddev)
- [
Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 🔗 Resources

- [Monad Documentation](https://docs.monad.xyz/)
- [Circom Documentation](https://docs.circom.io/)
- [Foundry Book](https://book.getfoundry.sh/)
- [ZK Proof Systems](https://zkp.science/)

## ⚠️ Production Checklist

Before mainnet deployment:

- [ ] Complete trusted setup ceremony (MPC)
- [ ] Replace MockGroth16Verifier with actual verifiers
- [ ] Professional security audit
- [ ] Test on Monad testnet extensively
- [ ] Verify all contracts on block explorer
- [ ] Set up monitoring and alerting
- [ ] Implement circuit upgradability
- [ ] Add multi-source data attestation
- [ ] Configure appropriate platform fees
- [ ] Legal compliance review

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Join our community Discord
- Read the documentation

---

**Built for Monad** 🚀

*Trust-minimized. Privacy-first. Fully automated.*
