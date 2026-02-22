// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/IdentityNFT.sol";
import "../src/IdentityRegistry.sol";
import "../src/Escrow.sol";
import "../src/CampaignManager.sol";
import "../src/SubmissionVerifier.sol";
import "../src/MockGroth16Verifier.sol";

/**
 * @title DeployMonadBlitz
 * @notice Deployment script for MonadBlitz data marketplace on Monad network
 * @dev Run with: forge script script/Deploy.s.sol:DeployMonadBlitz --rpc-url monad --broadcast
 */
contract DeployMonadBlitz is Script {
    // Configuration
    uint256 public constant PLATFORM_FEE = 250; // 2.5%
    
    // Deployed contract addresses (will be populated during deployment)
    address public identityNFT;
    address public identityRegistry;
    address public escrow;
    address public campaignManager;
    address public submissionVerifier;
    address public identityVerifier;
    address public dataVerifier;
    
    function run() external {
        // Get deployer from private key or use default for testing
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));
        address deployer = vm.addr(deployerPrivateKey);
        address feeRecipient = vm.envOr("FEE_RECIPIENT", deployer);
        
        console.log("Deploying MonadBlitz on Monad Network");
        console.log("Deployer address:", deployer);
        console.log("Fee recipient:", feeRecipient);
        console.log("Platform fee:", PLATFORM_FEE, "basis points (2.5%)");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy verification contracts
        // In production, replace MockGroth16Verifier with actual Groth16 verifiers
        // generated from circuits using snarkjs
        console.log("\n1. Deploying ZK Verifiers...");
        identityVerifier = address(new MockGroth16Verifier(true));
        console.log("   Identity Verifier deployed at:", identityVerifier);
        
        dataVerifier = address(new MockGroth16Verifier(true));
        console.log("   Data Verifier deployed at:", dataVerifier);
        
        // Deploy IdentityNFT
        console.log("\n2. Deploying IdentityNFT...");
        identityNFT = address(new IdentityNFT());
        console.log("   IdentityNFT deployed at:", identityNFT);
        
        // Deploy IdentityRegistry
        console.log("\n3. Deploying IdentityRegistry...");
        identityRegistry = address(new IdentityRegistry(identityNFT, identityVerifier));
        console.log("   IdentityRegistry deployed at:", identityRegistry);
        
        // Set IdentityRegistry in IdentityNFT
        console.log("\n4. Configuring IdentityNFT...");
        IdentityNFT(identityNFT).setIdentityRegistry(identityRegistry);
        console.log("   IdentityRegistry set in IdentityNFT");
        
        // Deploy Escrow
        console.log("\n5. Deploying Escrow...");
        escrow = address(new Escrow(feeRecipient, PLATFORM_FEE));
        console.log("   Escrow deployed at:", escrow);
        
        // Deploy CampaignManager
        console.log("\n6. Deploying CampaignManager...");
        campaignManager = address(new CampaignManager(identityRegistry, escrow));
        console.log("   CampaignManager deployed at:", campaignManager);
        
        // Deploy SubmissionVerifier
        console.log("\n7. Deploying SubmissionVerifier...");
        submissionVerifier = address(new SubmissionVerifier(
            identityRegistry,
            campaignManager,
            escrow,
            dataVerifier
        ));
        console.log("   SubmissionVerifier deployed at:", submissionVerifier);
        
        // Set SubmissionVerifier in Escrow
        console.log("\n8. Configuring Escrow...");
        Escrow(escrow).setSubmissionVerifier(submissionVerifier);
        console.log("   SubmissionVerifier set in Escrow");
        
        vm.stopBroadcast();
        
        // Print deployment summary
        printDeploymentSummary();
        
        // Save deployment addresses
        saveDeploymentAddresses();
    }
    
    function printDeploymentSummary() internal view {
        console.log("\n========================================");
        console.log("DEPLOYMENT SUMMARY - MONAD NETWORK");
        console.log("========================================");
        console.log("Identity Verifier:      ", identityVerifier);
        console.log("Data Verifier:          ", dataVerifier);
        console.log("IdentityNFT:            ", identityNFT);
        console.log("IdentityRegistry:       ", identityRegistry);
        console.log("Escrow:                 ", escrow);
        console.log("CampaignManager:        ", campaignManager);
        console.log("SubmissionVerifier:     ", submissionVerifier);
        console.log("========================================");
        console.log("\nNext steps:");
        console.log("1. Verify contracts on Monad explorer");
        console.log("2. In production, replace MockGroth16Verifier with actual verifiers");
        console.log("3. Test identity registration flow");
        console.log("4. Test campaign creation and submission flow");
        console.log("========================================\n");
    }
    
    function saveDeploymentAddresses() internal {
        string memory json = string.concat(
            '{\n',
            '  "network": "monad",\n',
            '  "timestamp": "', vm.toString(block.timestamp), '",\n',
            '  "contracts": {\n',
            '    "IdentityVerifier": "', vm.toString(identityVerifier), '",\n',
            '    "DataVerifier": "', vm.toString(dataVerifier), '",\n',
            '    "IdentityNFT": "', vm.toString(identityNFT), '",\n',
            '    "IdentityRegistry": "', vm.toString(identityRegistry), '",\n',
            '    "Escrow": "', vm.toString(escrow), '",\n',
            '    "CampaignManager": "', vm.toString(campaignManager), '",\n',
            '    "SubmissionVerifier": "', vm.toString(submissionVerifier), '"\n',
            '  }\n',
            '}'
        );
        
        vm.writeFile("deployments/monad-latest.json", json);
        console.log("Deployment addresses saved to deployments/monad-latest.json");
    }
}
