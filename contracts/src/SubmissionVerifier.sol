// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IdentityRegistry.sol";
import "./CampaignManager.sol";
import "./Escrow.sol";
import "./interfaces/IGroth16Verifier.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SubmissionVerifier
 * @notice Verifies data submissions using ZK proofs and manages payouts
 * @dev Core contract that orchestrates identity verification, data proof verification, and payment
 *      User submission data is stored on Filecoin for decentralized, verifiable storage
 */
contract SubmissionVerifier is ReentrancyGuard {
    struct Submission {
        address submitter;
        uint256 campaignId;
        string submissionFilecoinCID; // Filecoin CID containing user's submission data, responses, attachments
        bytes32 submissionHash; // Hash of submission data for integrity verification
        bytes32 campaignNullifier;
        uint256 timestamp;
        bool verified;
    }
    
    IdentityRegistry public immutable identityRegistry;
    CampaignManager public immutable campaignManager;
    Escrow public immutable escrow;
    IGroth16Verifier public immutable dataProofVerifier;
    
    // Mapping from submission ID to Submission
    mapping(uint256 => Submission) public submissions;
    
    // Mapping of campaign nullifiers to prevent duplicate submissions
    mapping(bytes32 => bool) public usedCampaignNullifiers;
    
    // Counter for submission IDs
    uint256 private _submissionIdCounter;
    
    error OnlyVerifiedIdentity();
    error CampaignNotActive();
    error NullifierAlreadyUsed();
    error IdentityProofFailed();
    error DataProofFailed();
    error InsufficientBudget();
    
    event SubmissionVerified(
        uint256 indexed submissionId,
        uint256 indexed campaignId,
        address indexed submitter,
        string submissionFilecoinCID,
        bytes32 submissionHash,
        uint256 payout
    );
    
    constructor(
        address _identityRegistry,
        address _campaignManager,
        address _escrow,
        address _dataProofVerifier
    ) {
        identityRegistry = IdentityRegistry(_identityRegistry);
        campaignManager = CampaignManager(_campaignManager);
        escrow = Escrow(_escrow);
        dataProofVerifier = IGroth16Verifier(_dataProofVerifier);
        _submissionIdCounter = 1;
    }
    
    /**
     * @notice Submit data with ZK proofs for a campaign
     * @param campaignId The campaign ID
     * @param identityProof ZK proof of identity
     * @param dataProof ZK proof that data satisfies campaign constraints
     * @param campaignNullifier Nullifier to prevent duplicate submissions to same campaign
     * @param submissionFilecoinCID Filecoin CID of user's submission data (responses, attachments, etc.)
     * @param submissionHash Hash of submission data for integrity verification
     * @param identityPublicSignals Public signals for identity proof
     * @param dataPublicSignals Public signals for data proof
     * @return submissionId The ID of the submission
     */
    function submitData(
        uint256 campaignId,
        uint256[8] calldata identityProof,
        uint256[8] calldata dataProof,
        bytes32 campaignNullifier,
        string calldata submissionFilecoinCID,
        bytes32 submissionHash,
        uint256[] calldata identityPublicSignals,
        uint256[] calldata dataPublicSignals
    ) external nonReentrant returns (uint256) {
        // 1. Verify user has identity NFT
        if (!identityRegistry.hasVerifiedIdentity(msg.sender)) {
            revert OnlyVerifiedIdentity();
        }
        
        // 2. Check campaign is active
        if (!campaignManager.isCampaignActive(campaignId)) {
            revert CampaignNotActive();
        }
        
        // 3. Check campaign nullifier hasn't been used
        if (usedCampaignNullifiers[campaignNullifier]) {
            revert NullifierAlreadyUsed();
        }
        
        // 4. Verify identity proof (proves user uniqueness for this submission)
        bool identityValid = dataProofVerifier.verifyProof(
            [identityProof[0], identityProof[1]],
            [[identityProof[2], identityProof[3]], [identityProof[4], identityProof[5]]],
            [identityProof[6], identityProof[7]],
            identityPublicSignals
        );
        
        if (!identityValid) revert IdentityProofFailed();
        
        // 5. Verify data constraint proof (proves data satisfies campaign requirements)
        bool dataValid = dataProofVerifier.verifyProof(
            [dataProof[0], dataProof[1]],
            [[dataProof[2], dataProof[3]], [dataProof[4], dataProof[5]]],
            [dataProof[6], dataProof[7]],
            dataPublicSignals
        );
        
        if (!dataValid) revert DataProofFailed();
        
        // 6. Get campaign details
        CampaignManager.Campaign memory campaign = campaignManager.getCampaign(campaignId);
        
        // 7. Check budget availability
        if (escrow.getRemainingBudget(campaignId) < campaign.pricePerSubmission) {
            revert InsufficientBudget();
        }
        
        // 8. Mark nullifier as used
        usedCampaignNullifiers[campaignNullifier] = true;
        
        // 9. Create submission record
        uint256 submissionId = _submissionIdCounter++;
        submissions[submissionId] = Submission({
            submitter: msg.sender,
            campaignId: campaignId,
            submissionFilecoinCID: submissionFilecoinCID,
            submissionHash: submissionHash,
            campaignNullifier: campaignNullifier,
            timestamp: block.timestamp,
            verified: true
        });
        
        // 10. Release payment from escrow (atomic with verification)
        escrow.release(campaignId, msg.sender, campaign.pricePerSubmission);
        
        // 11. Increment campaign submission count
        campaignManager.incrementSubmissionCount(campaignId);
        
        emit SubmissionVerified(
            submissionId,
            campaignId,
            msg.sender,
            submissionFilecoinCID,
            submissionHash,
            campaign.pricePerSubmission
        );
        
        return submissionId;
    }
    
    /**
     * @notice Get submission details
     * @param submissionId The submission ID
     * @return Submission struct
     */
    function getSubmission(uint256 submissionId) external view returns (Submission memory) {
        return submissions[submissionId];
    }
    
    /**
     * @notice Check if a campaign nullifier has been used
     * @param nullifier The nullifier to check
     * @return bool True if nullifier has been used
     */
    function isNullifierUsed(bytes32 nullifier) external view returns (bool) {
        return usedCampaignNullifiers[nullifier];
    }
    
    /**
     * @notice Get total number of submissions
     * @return uint256 Total submissions
     */
    function getTotalSubmissions() external view returns (uint256) {
        return _submissionIdCounter - 1;
    }
}
