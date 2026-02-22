// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IdentityNFT.sol";
import "./interfaces/IGroth16Verifier.sol";

/**
 * @title IdentityRegistry
 * @notice Manages unique human identity verification using ZK proofs
 * @dev Prevents multiple registrations using nullifiers
 */
contract IdentityRegistry {
    IdentityNFT public immutable identityNFT;
    IGroth16Verifier public immutable verifier;
    
    // Mapping of registration nullifiers to prevent duplicate registrations
    mapping(bytes32 => bool) public usedNullifiers;
    
    // Mapping of addresses to their registration status
    mapping(address => bool) public isRegistered;
    
    error NullifierAlreadyUsed();
    error ProofVerificationFailed();
    error AlreadyRegistered();
    
    event IdentityRegistered(address indexed user, bytes32 indexed nullifier, uint256 tokenId);
    
    constructor(address _identityNFT, address _verifier) {
        identityNFT = IdentityNFT(_identityNFT);
        verifier = IGroth16Verifier(_verifier);
    }
    
    /**
     * @notice Register a new identity with ZK proof verification
     * @param proof The ZK proof data
     * @param nullifier The registration nullifier (prevents duplicate registrations)
     * @param publicSignals Public signals for the ZK proof
     */
    function registerIdentity(
        uint256[8] calldata proof,
        bytes32 nullifier,
        uint256[] calldata publicSignals
    ) external {
        // Check if already registered
        if (isRegistered[msg.sender]) revert AlreadyRegistered();
        
        // Check if nullifier has been used
        if (usedNullifiers[nullifier]) revert NullifierAlreadyUsed();
        
        // Verify the ZK proof
        bool isValid = verifier.verifyProof(
            [proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            publicSignals
        );
        
        if (!isValid) revert ProofVerificationFailed();
        
        // Mark nullifier as used
        usedNullifiers[nullifier] = true;
        
        // Mark address as registered
        isRegistered[msg.sender] = true;
        
        // Mint soulbound identity NFT
        uint256 tokenId = identityNFT.mint(msg.sender);
        
        emit IdentityRegistered(msg.sender, nullifier, tokenId);
    }
    
    /**
     * @notice Check if an address has a verified identity
     * @param user Address to check
     * @return bool True if user has verified identity
     */
    function hasVerifiedIdentity(address user) external view returns (bool) {
        return isRegistered[user] && identityNFT.hasIdentity(user);
    }
    
    /**
     * @notice Check if a nullifier has been used
     * @param nullifier The nullifier to check
     * @return bool True if nullifier has been used
     */
    function isNullifierUsed(bytes32 nullifier) external view returns (bool) {
        return usedNullifiers[nullifier];
    }
}
