pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

/**
 * Campaign Submission Proof Circuit
 * 
 * Proves:
 * 1. User's data satisfies campaign constraints without revealing raw data
 * 2. Generates campaign-specific nullifier to prevent duplicate submissions
 * 3. Data is within valid ranges (age, region, behavior metrics)
 * 
 * For MVP: 3 attributes
 * - Age range (18-65)
 * - Region (represented as integer 0-10 for simplicity)
 * - Behavior metric (e.g., transaction count in range)
 * 
 * Public inputs:
 * - campaignId: The campaign identifier
 * - campaignNullifier: Nullifier for this specific campaign
 * - minAge, maxAge: Age range constraints
 * - allowedRegion: Required region
 * - minBehaviorMetric, maxBehaviorMetric: Behavior metric range
 * 
 * Private inputs:
 * - identitySecret: User's secret (same as registration)
 * - age: User's actual age
 * - region: User's region
 * - behaviorMetric: User's behavior metric value
 * - dataHash: Hash of the encrypted data stored on IPFS
 */
template CampaignSubmissionProof() {
    // Private inputs
    signal input identitySecret;
    signal input age;
    signal input region;
    signal input behaviorMetric;
    signal input dataHash;
    
    // Public inputs (constraints)
    signal input campaignId;
    signal input minAge;
    signal input maxAge;
    signal input allowedRegion;
    signal input minBehaviorMetric;
    signal input maxBehaviorMetric;
    
    // Public outputs
    signal output campaignNullifier;
    signal output dataCommitment;
    
    // Generate campaign-specific nullifier
    component nullifierHasher = Poseidon(2);
    nullifierHasher.inputs[0] <== identitySecret;
    nullifierHasher.inputs[1] <== campaignId;
    campaignNullifier <== nullifierHasher.out;
    
    // Data commitment (proves data integrity)
    component dataCommit = Poseidon(4);
    dataCommit.inputs[0] <== age;
    dataCommit.inputs[1] <== region;
    dataCommit.inputs[2] <== behaviorMetric;
    dataCommit.inputs[3] <== dataHash;
    dataCommitment <== dataCommit.out;
    
    // Age range check
    component ageMinCheck = GreaterEqThan(32);
    ageMinCheck.in[0] <== age;
    ageMinCheck.in[1] <== minAge;
    ageMinCheck.out === 1;
    
    component ageMaxCheck = LessEqThan(32);
    ageMaxCheck.in[0] <== age;
    ageMaxCheck.in[1] <== maxAge;
    ageMaxCheck.out === 1;
    
    // Region check (exact match for simplicity in MVP)
    component regionCheck = IsEqual();
    regionCheck.in[0] <== region;
    regionCheck.in[1] <== allowedRegion;
    regionCheck.out === 1;
    
    // Behavior metric range check
    component behaviorMinCheck = GreaterEqThan(32);
    behaviorMinCheck.in[0] <== behaviorMetric;
    behaviorMinCheck.in[1] <== minBehaviorMetric;
    behaviorMinCheck.out === 1;
    
    component behaviorMaxCheck = LessEqThan(32);
    behaviorMaxCheck.in[0] <== behaviorMetric;
    behaviorMaxCheck.in[1] <== maxBehaviorMetric;
    behaviorMaxCheck.out === 1;
}

component main {public [
    campaignId,
    minAge,
    maxAge,
    allowedRegion,
    minBehaviorMetric,
    maxBehaviorMetric,
    campaignNullifier,
    dataCommitment
]} = CampaignSubmissionProof();
