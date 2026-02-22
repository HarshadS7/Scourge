# ZK Circuits for MonadBlitz

This directory contains Circom circuits for zero-knowledge proof generation.

## Circuits

### 1. identityProof.circom
**Purpose**: Proves unique human identity without revealing personal information.

**Private Inputs**:
- `identitySecret`: User's secret value
- `credentialHash`: Hash of verifiable credential from trusted attester

**Public Outputs**:
- `nullifier`: Registration nullifier (prevents duplicate registrations)
- `credentialCommitment`: Commitment to credential

**Use Case**: One-time registration to mint soulbound Identity NFT

---

### 2. campaignSubmissionProof.circom
**Purpose**: Proves data satisfies campaign constraints without revealing raw data.

**Private Inputs**:
- `identitySecret`: User's secret (same as registration)
- `age`: User's actual age
- `region`: User's region code
- `behaviorMetric`: User's behavior metric (e.g., transaction count)
- `dataHash`: Hash of encrypted data on IPFS

**Public Inputs (Constraints)**:
- `campaignId`: Campaign identifier
- `minAge`, `maxAge`: Age range
- `allowedRegion`: Required region
- `minBehaviorMetric`, `maxBehaviorMetric`: Behavior metric range

**Public Outputs**:
- `campaignNullifier`: Campaign-specific nullifier (prevents duplicate submissions)
- `dataCommitment`: Commitment to submitted data

**Use Case**: Submit data for a campaign while maintaining privacy

---

## Setup Instructions

### Prerequisites
```bash
# Install circom
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# Install snarkjs
npm install -g snarkjs

# Install circomlib
npm install circomlib
```

### Compile Circuits

```bash
# Compile identity proof circuit
circom circuits/identityProof.circom --r1cs --wasm --sym -o build/identityProof

# Compile campaign submission proof circuit
circom circuits/campaignSubmissionProof.circom --r1cs --wasm --sym -o build/campaignSubmissionProof
```

### Generate Trusted Setup (Powers of Tau)

```bash
# Start powers of tau ceremony
snarkjs powersoftau new bn128 14 pot14_0000.ptau -v

# Contribute to ceremony
snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="First contribution" -v

# Prepare phase 2
snarkjs powersoftau prepare phase2 pot14_0001.ptau pot14_final.ptau -v

# Generate zkey for identity proof
snarkjs groth16 setup build/identityProof/identityProof.r1cs pot14_final.ptau identityProof_0000.zkey

# Contribute to phase 2
snarkjs zkey contribute identityProof_0000.zkey identityProof_final.zkey --name="Identity proof contribution" -v

# Export verification key
snarkjs zkey export verificationkey identityProof_final.zkey verification_key_identity.json

# Generate Solidity verifier
snarkjs zkey export solidityverifier identityProof_final.zkey IdentityVerifier.sol

# Repeat for campaign submission proof
snarkjs groth16 setup build/campaignSubmissionProof/campaignSubmissionProof.r1cs pot14_final.ptau campaignSubmissionProof_0000.zkey
snarkjs zkey contribute campaignSubmissionProof_0000.zkey campaignSubmissionProof_final.zkey --name="Campaign proof contribution" -v
snarkjs zkey export verificationkey campaignSubmissionProof_final.zkey verification_key_campaign.json
snarkjs zkey export solidityverifier campaignSubmissionProof_final.zkey CampaignVerifier.sol
```

### Generate Proofs

```bash
# Create input JSON file (example for identity proof)
cat > input_identity.json <<EOF
{
  "identitySecret": "123456789",
  "credentialHash": "987654321"
}
EOF

# Generate witness
node build/identityProof/identityProof_js/generate_witness.js \
  build/identityProof/identityProof_js/identityProof.wasm \
  input_identity.json \
  witness.wtns

# Generate proof
snarkjs groth16 prove identityProof_final.zkey witness.wtns proof.json public.json

# Verify proof (off-chain)
snarkjs groth16 verify verification_key_identity.json public.json proof.json
```

---

## Integration with Smart Contracts

The generated Solidity verifiers (`IdentityVerifier.sol` and `CampaignVerifier.sol`) should be deployed and their addresses passed to:
- `IdentityRegistry` constructor (uses identity verifier)
- `SubmissionVerifier` constructor (uses campaign verifier)

For MVP/testing, use `MockGroth16Verifier.sol` which accepts any proof.

---

## Security Considerations

1. **Trusted Setup**: In production, use a multi-party computation ceremony
2. **Circuit Auditing**: Circuits should be audited for logical vulnerabilities
3. **Nullifier Generation**: Ensures uniqueness without revealing identity
4. **Data Integrity**: Raw data must come from verifiable sources (not self-reported)
5. **Constraint Verification**: All constraints must be checked in-circuit, not just validated off-chain

---

## MVP Simplifications

For hackathon/MVP, we use:
- Simple 3-attribute model (age, region, behavior metric)
- Mock verifier for testing
- Pre-generated trusted setup (not production-suitable)
- Basic range proofs only

Production would require:
- Multi-source data attestation circuits
- More sophisticated constraint systems
- Proper MPC trusted setup
- Device attestation integration
- Recursive proof composition for scalability
