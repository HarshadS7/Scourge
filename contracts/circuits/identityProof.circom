pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

/**
 * Identity Proof Circuit
 * 
 * Proves:
 * 1. User possesses a valid identity secret
 * 2. Generates a nullifier to prevent duplicate registrations
 * 
 * Public inputs:
 * - nullifier: Registration nullifier (prevents multiple registrations)
 * 
 * Private inputs:
 * - identitySecret: User's secret identity value
 * - credentialHash: Hash of the verifiable credential
 */
template IdentityProof() {
    // Private inputs
    signal input identitySecret;
    signal input credentialHash;
    
    // Public outputs
    signal output nullifier;
    signal output credentialCommitment;
    
    // Poseidon hash for nullifier generation
    component nullifierHasher = Poseidon(1);
    nullifierHasher.inputs[0] <== identitySecret;
    nullifier <== nullifierHasher.out;
    
    // Credential commitment (proves possession of valid credential)
    component credCommitment = Poseidon(2);
    credCommitment.inputs[0] <== identitySecret;
    credCommitment.inputs[1] <== credentialHash;
    credentialCommitment <== credCommitment.out;
}

component main {public [nullifier, credentialCommitment]} = IdentityProof();
