// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/IdentityRegistry.sol";
import "../src/CampaignManager.sol";
import "../src/SubmissionVerifier.sol";

/**
 * @title InteractMonadBlitz
 * @notice Helper script for interacting with deployed MonadBlitz contracts
 * @dev Load deployment addresses from deployments/monad-latest.json
 */
contract InteractMonadBlitz is Script {
    
    function registerIdentity(
        address registryAddress,
        uint256[8] memory proof,
        bytes32 nullifier,
        uint256[] memory publicSignals
    ) external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(privateKey);
        
        IdentityRegistry registry = IdentityRegistry(registryAddress);
        registry.registerIdentity(proof, nullifier, publicSignals);
        
        console.log("Identity registered successfully");
        console.log("User:", vm.addr(privateKey));
        console.log("Nullifier:", vm.toString(nullifier));
        
        vm.stopBroadcast();
    }
    
    function createCampaign(
        address campaignManagerAddress,
        string memory ipfsHash,
        uint256 pricePerSubmission,
        uint256 collectionDuration,
        uint256 daysUntilDeadline,
        bytes32 constraintsHash,
        uint256 budget
    ) external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(privateKey);
        
        CampaignManager manager = CampaignManager(campaignManagerAddress);
        uint256 deadline = block.timestamp + (daysUntilDeadline * 1 days);
        
        uint256 campaignId = manager.createCampaign{value: budget}(
            ipfsHash,
            pricePerSubmission,
            collectionDuration,
            deadline,
            constraintsHash
        );
        
        console.log("Campaign created successfully");
        console.log("Campaign ID:", campaignId);
        console.log("Budget:", budget);
        console.log("Price per submission:", pricePerSubmission);
        console.log("Deadline:", deadline);
        
        vm.stopBroadcast();
    }
    
    function submitData(
        address submissionVerifierAddress,
        uint256 campaignId,
        uint256[8] memory identityProof,
        uint256[8] memory dataProof,
        bytes32 campaignNullifier,
        string memory encryptedDataIPFSHash,
        uint256[] memory identityPublicSignals,
        uint256[] memory dataPublicSignals
    ) external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(privateKey);
        
        SubmissionVerifier verifier = SubmissionVerifier(submissionVerifierAddress);
        
        uint256 submissionId = verifier.submitData(
            campaignId,
            identityProof,
            dataProof,
            campaignNullifier,
            encryptedDataIPFSHash,
            identityPublicSignals,
            dataPublicSignals
        );
        
        console.log("Data submitted successfully");
        console.log("Submission ID:", submissionId);
        console.log("Campaign ID:", campaignId);
        console.log("IPFS Hash:", encryptedDataIPFSHash);
        
        vm.stopBroadcast();
    }
    
    function checkIdentity(address registryAddress, address user) external view {
        IdentityRegistry registry = IdentityRegistry(registryAddress);
        bool hasIdentity = registry.hasVerifiedIdentity(user);
        
        console.log("User:", user);
        console.log("Has Verified Identity:", hasIdentity);
    }
    
    function getCampaignInfo(address campaignManagerAddress, uint256 campaignId) external view {
        CampaignManager manager = CampaignManager(campaignManagerAddress);
        CampaignManager.Campaign memory campaign = manager.getCampaign(campaignId);
        
        console.log("Campaign ID:", campaignId);
        console.log("Company:", campaign.company);
        console.log("Price per submission:", campaign.pricePerSubmission);
        console.log("Total budget:", campaign.totalBudget);
        console.log("Deadline:", campaign.deadline);
        console.log("Collection duration (days):", campaign.collectionDuration);
        console.log("Submission count:", campaign.submissionCount);
        console.log("Active:", campaign.active);
    }
}
