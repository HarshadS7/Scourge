# MonadBlitz System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (Web3 dApp / Mobile App)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OFF-CHAIN SERVICES                         │
├─────────────────────────────────────────────────────────────────┤
│  • ZK Proof Generation (circom/snarkjs)                        │
│  • Data Collection & Verification                               │
│  • IPFS Encrypted Storage                                       │
│  • Event Monitoring & Indexing                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONAD BLOCKCHAIN LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │  Identity Layer  │  │  Campaign Layer  │                   │
│  ├──────────────────┤  ├──────────────────┤                   │
│  │ IdentityNFT      │  │ CampaignManager  │                   │
│  │ IdentityRegistry │  │ Escrow           │                   │
│  └──────────────────┘  └──────────────────┘                   │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │ Verification     │  │ ZK Verifiers     │                   │
│  │ Layer            │  │                  │                   │
│  ├──────────────────┤  ├──────────────────┤                   │
│  │ SubmissionVerif. │  │ Groth16Verifiers │                   │
│  └──────────────────┘  └──────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

## Contract Interaction Flow

### 1. User Registration Flow

```
User
  │
  ├─── Generate identity_secret
  │
  ├─── Obtain Verifiable Credential (bank/telco/KYC)
  │
  ├─── Generate ZK proof (identityProof.circom)
  │     ├─ Private: identity_secret, credential_hash
  │     └─ Public: registration_nullifier, credential_commitment
  │
  ▼
IdentityRegistry
  │
  ├─── Verify ZK proof via Groth16Verifier
  │
  ├─── Check nullifier not used
  │
  ├─── Mark nullifier as used
  │
  ▼
IdentityNFT
  │
  └─── Mint soulbound NFT to user
```

### 2. Campaign Creation Flow

```
Company
  │
  ├─── Define required attributes
  │     (age range, region, behavior metrics)
  │
  ├─── Create constraints hash
  │
  ├─── Upload metadata to IPFS
  │
  ▼
CampaignManager
  │
  ├─── Create campaign record
  │
  ├─── Store campaign metadata & constraints
  │
  ▼
Escrow
  │
  ├─── Lock company's budget (msg.value)
  │
  └─── Set deadline for refund
```

### 3. Data Submission Flow

```
User
  │
  ├─── Collect verified data (30 days)
  │     • Bank transactions
  │     • UPI statements
  │     • Location data (verified)
  │
  ├─── Generate ZK proofs
  │     ├─ Identity proof (still unique)
  │     └─ Data constraint proof
  │         ├─ Private: age, region, behavior_metric, data_hash
  │         └─ Public: campaign_id, min/max bounds, campaign_nullifier
  │
  ├─── Encrypt full dataset (AES-256-GCM)
  │
  ├─── Upload to IPFS → get CID
  │
  ▼
SubmissionVerifier
  │
  ├─── Check user has Identity NFT
  │
  ├─── Verify campaign active & has budget
  │
  ├─── Check campaign_nullifier unused
  │
  ├─── Verify identity proof
  │
  ├─── Verify data constraint proof
  │
  ├─── Mark campaign_nullifier used
  │
  ▼
Escrow (atomic release)
  │
  ├─── Calculate platform fee (2.5%)
  │
  ├─── Transfer (amount - fee) to user
  │
  ├─── Transfer fee to platform
  │
  └─── Update remaining budget
  │
  ▼
Event Emitted
  │
  └─── SubmissionVerified(submissionId, campaignId, user, ipfsCID, payout)
       │
       └─── Company can now decrypt data using revealed key
```

## Nullifier Architecture

### Purpose
Prevent duplicate registrations and submissions without revealing identity.

### Registration Nullifier
```
registration_nullifier = Poseidon(identity_secret)
```
- Stored on-chain in `IdentityRegistry.usedNullifiers`
- Prevents same person from creating multiple accounts
- Cannot be linked to user's address

### Campaign Nullifier
```
campaign_nullifier = Poseidon(identity_secret, campaign_id)
```
- Stored on-chain in `SubmissionVerifier.usedCampaignNullifiers`
- Prevents same person from submitting to same campaign twice
- Different for each campaign (user can submit to multiple campaigns)
- Cannot be linked across campaigns

### Security Properties
- **Unlinkability**: Different nullifiers for different campaigns
- **Uniqueness**: Same nullifier if same identity_secret used
- **Privacy**: Nullifier doesn't reveal identity_secret
- **Determinism**: Same inputs always produce same nullifier

## Zero-Knowledge Proof Circuits

### Identity Proof Circuit

**File**: `circuits/identityProof.circom`

**Purpose**: Prove possession of valid identity credential

```circom
Inputs:
  Private:
    - identity_secret: User's secret value
    - credential_hash: Hash of verifiable credential
  
  Public (outputs):
    - nullifier: Poseidon(identity_secret)
    - credential_commitment: Poseidon(identity_secret, credential_hash)

Constraints:
  - Proves knowledge of identity_secret
  - Proves knowledge of credential_hash
  - Correctly computes nullifier
  - Correctly computes commitment
```

### Campaign Submission Proof Circuit

**File**: `circuits/campaignSubmissionProof.circom`

**Purpose**: Prove data satisfies campaign constraints

```circom
Inputs:
  Private:
    - identity_secret: User's secret (same as registration)
    - age: Actual age
    - region: Actual region code
    - behavior_metric: Actual metric value
    - data_hash: Hash of encrypted IPFS data
  
  Public:
    - campaign_id: Campaign identifier
    - min_age, max_age: Age range constraints
    - allowed_region: Required region
    - min_behavior_metric, max_behavior_metric: Metric range
    - campaign_nullifier: Poseidon(identity_secret, campaign_id)
    - data_commitment: Poseidon(age, region, behavior_metric, data_hash)

Constraints:
  - age >= min_age AND age <= max_age
  - region == allowed_region
  - behavior_metric >= min_behavior_metric
  - behavior_metric <= max_behavior_metric
  - Correctly computes campaign_nullifier
  - Correctly computes data_commitment
```

## Data Flow & Privacy

### What's Visible On-Chain
✅ Campaign constraints (age range, region, metric bounds)
✅ Nullifiers (pseudonymous, unlinkable)
✅ IPFS CIDs (encrypted data)
✅ Proof verification results (valid/invalid)
✅ Payment amounts

### What's NOT Visible On-Chain
❌ User's real identity
❌ Actual age, region, behavior metrics
❌ Raw data content
❌ Link between user address and multiple campaigns
❌ Identity_secret

### Data Encryption Layer
```
User Data → AES-256-GCM encryption → IPFS → CID stored on-chain
                ↑
                └─ Decryption key revealed only after escrow release
```

## Economic Security

### Platform Fee Structure
- Default: 2.5% (250 basis points)
- Configurable by platform owner
- Maximum: 10% (hard-coded limit)

### Escrow Workflow
1. Company deposits full budget
2. Budget locked until submissions or deadline
3. Atomic release on valid proof (prevents theft)
4. Refund available after deadline expires
5. No manual approval/rejection (trustless)

### Attack Prevention

| Attack | Prevention |
|--------|------------|
| Sybil (multiple accounts) | Registration nullifiers + ZK proofs |
| Double submission | Campaign nullifiers |
| Fake data | Data must come from verifiable sources |
| Company refuses payment | Atomic escrow release |
| Company sees data without paying | Data encrypted until payment |
| User reuses data | Campaign-specific nullifiers |
| Deanonymization | Query limits, attribute thresholds |

## Monad-Specific Optimizations

### Parallel Execution
- Independent user submissions execute in parallel
- Multiple campaigns can be created simultaneously
- Identity verifications parallelizable

### Gas Efficiency
- Via-IR compilation for optimized bytecode
- Minimal on-chain storage (use events + IPFS)
- Efficient proof verification (Groth16)

### High Throughput
- Monad's 10,000 TPS enables mass data submissions
- Low latency verification
- Instant payment settlement

## Upgrade Path

### Phase 1: MVP (Current)
- MockGroth16Verifier for testing
- 3 simple attributes
- Basic range proofs
- Single verifier contract

### Phase 2: Production
- Real Groth16 verifiers from MPC ceremony
- Multi-source data attestation
- Device attestation integration
- Differential privacy layer

### Phase 3: Advanced
- Recursive proof composition
- Cross-chain identity
- ML model training on encrypted data
- DAO governance

## Security Considerations

### Trusted Setup
- Current: Mock verifier (testing only)
- Production: Multi-party computation ceremony
- Participants: 10+ independent parties
- Process: Powers of Tau → Phase 2 → Verifier contract

### Circuit Auditing
- Formal verification of constraint completeness
- Check for under-constrained signals
- Verify nullifier uniqueness guarantees
- Test proof generation with malicious inputs

### Contract Auditing
- Access control verification
- Reentrancy protection (nonReentrant modifier)
- Integer overflow checks (Solidity 0.8+)
- Gas optimization review

## Monitoring & Analytics

### On-Chain Events
```solidity
event IdentityRegistered(address indexed user, bytes32 indexed nullifier, uint256 tokenId);
event CampaignCreated(uint256 indexed campaignId, address indexed company, ...);
event SubmissionVerified(uint256 indexed submissionId, uint256 indexed campaignId, ...);
event Released(uint256 indexed campaignId, address indexed recipient, uint256 amount, uint256 fee);
```

### Metrics to Track
- Total registered users
- Active campaigns
- Successful submissions
- Total volume (MON)
- Platform fee revenue
- Average time to submission
- Proof verification success rate

---

This architecture ensures:
1. **Privacy**: ZK proofs reveal only necessary constraints
2. **Security**: Nullifiers prevent duplicate usage
3. **Trust-minimization**: Atomic escrow, no manual approval
4. **Scalability**: Leverages Monad's high performance
5. **Verifiability**: All actions auditable on-chain
