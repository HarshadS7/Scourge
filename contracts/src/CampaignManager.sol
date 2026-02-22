// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IdentityRegistry.sol";
import "./Escrow.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CampaignManager
 * @notice Manages data collection campaigns posted by companies
 * @dev Handles campaign creation, metadata storage, and constraint definitions
 */
contract CampaignManager is Ownable {
    struct Campaign {
        address company;
        string attributesIPFSHash; // IPFS hash containing required attributes and constraints
        uint256 pricePerSubmission;
        uint256 totalBudget;
        uint256 deadline;
        uint256 collectionDuration; // Duration in days for data collection (e.g., 30 days)
        uint256 submissionCount;
        bool active;
        bytes32 constraintsHash; // Hash of the constraint definitions
    }
    
    uint256 private _campaignIdCounter;
    
    // Mapping from campaign ID to Campaign
    mapping(uint256 => Campaign) public campaigns;
    
    IdentityRegistry public immutable identityRegistry;
    Escrow public immutable escrow;
    
    error OnlyVerifiedIdentity();
    error InsufficientBudget();
    error InvalidDeadline();
    error InvalidPrice();
    error CampaignNotActive();
    
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed company,
        uint256 pricePerSubmission,
        uint256 totalBudget,
        uint256 deadline
    );
    
    event CampaignDeactivated(uint256 indexed campaignId);
    
    modifier onlyVerified() {
        if (!identityRegistry.hasVerifiedIdentity(msg.sender)) {
            revert OnlyVerifiedIdentity();
        }
        _;
    }
    
    constructor(address _identityRegistry, address _escrow) Ownable(msg.sender) {
        identityRegistry = IdentityRegistry(_identityRegistry);
        escrow = Escrow(_escrow);
        _campaignIdCounter = 1;
    }
    
    /**
     * @notice Create a new data collection campaign
     * @param attributesIPFSHash IPFS hash containing campaign metadata and required attributes
     * @param pricePerSubmission Price paid per valid submission
     * @param collectionDuration Duration in days for data collection
     * @param deadline Campaign deadline timestamp
     * @param constraintsHash Hash of the ZK proof constraints
     * @return campaignId The ID of the created campaign
     */
    function createCampaign(
        string calldata attributesIPFSHash,
        uint256 pricePerSubmission,
        uint256 collectionDuration,
        uint256 deadline,
        bytes32 constraintsHash
    ) external payable returns (uint256) {
        if (deadline <= block.timestamp) revert InvalidDeadline();
        if (pricePerSubmission == 0) revert InvalidPrice();
        if (msg.value < pricePerSubmission) revert InsufficientBudget();
        
        uint256 campaignId = _campaignIdCounter++;
        
        campaigns[campaignId] = Campaign({
            company: msg.sender,
            attributesIPFSHash: attributesIPFSHash,
            pricePerSubmission: pricePerSubmission,
            totalBudget: msg.value,
            deadline: deadline,
            collectionDuration: collectionDuration,
            submissionCount: 0,
            active: true,
            constraintsHash: constraintsHash
        });
        
        // Deposit funds to escrow
        escrow.deposit{value: msg.value}(campaignId, msg.value, deadline);
        
        emit CampaignCreated(
            campaignId,
            msg.sender,
            pricePerSubmission,
            msg.value,
            deadline
        );
        
        return campaignId;
    }
    
    /**
     * @notice Increment submission count for a campaign
     * @param campaignId The campaign ID
     * @dev Called by SubmissionVerifier after successful verification
     */
    function incrementSubmissionCount(uint256 campaignId) external {
        // In production, add access control to only allow SubmissionVerifier
        campaigns[campaignId].submissionCount++;
    }
    
    /**
     * @notice Deactivate a campaign
     * @param campaignId The campaign ID
     */
    function deactivateCampaign(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId];
        
        if (msg.sender != campaign.company && msg.sender != owner()) {
            revert();
        }
        
        campaign.active = false;
        emit CampaignDeactivated(campaignId);
    }
    
    /**
     * @notice Get campaign details
     * @param campaignId The campaign ID
     * @return Campaign struct
     */
    function getCampaign(uint256 campaignId) external view returns (Campaign memory) {
        return campaigns[campaignId];
    }
    
    /**
     * @notice Check if a campaign is active and accepting submissions
     * @param campaignId The campaign ID
     * @return bool True if campaign is active
     */
    function isCampaignActive(uint256 campaignId) external view returns (bool) {
        Campaign memory campaign = campaigns[campaignId];
        return campaign.active && 
               block.timestamp < campaign.deadline &&
               escrow.getRemainingBudget(campaignId) >= campaign.pricePerSubmission;
    }
    
    /**
     * @notice Get total number of campaigns
     * @return uint256 Total campaigns created
     */
    function getTotalCampaigns() external view returns (uint256) {
        return _campaignIdCounter - 1;
    }
}
