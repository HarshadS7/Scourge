// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CampaignManager.sol";
import "../src/IdentityRegistry.sol";
import "../src/IdentityNFT.sol";
import "../src/Escrow.sol";
import "../src/MockGroth16Verifier.sol";

contract CampaignManagerTest is Test {
    CampaignManager public campaignManager;
    IdentityRegistry public identityRegistry;
    IdentityNFT public identityNFT;
    Escrow public escrow;
    MockGroth16Verifier public verifier;
    
    address public company = address(0x1);
    address public user = address(0x2);
    address public feeRecipient = address(0x3);
    
    uint256[8] public validProof = [1, 2, 3, 4, 5, 6, 7, 8];
    uint256[] public validPublicSignals;
    
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed company,
        uint256 pricePerSubmission,
        uint256 totalBudget,
        uint256 deadline
    );
    
    function setUp() public {
        // Deploy all contracts
        verifier = new MockGroth16Verifier(true);
        identityNFT = new IdentityNFT();
        identityRegistry = new IdentityRegistry(address(identityNFT), address(verifier));
        escrow = new Escrow(feeRecipient, 250); // 2.5% fee
        campaignManager = new CampaignManager(address(identityRegistry), address(escrow));
        
        identityNFT.setIdentityRegistry(address(identityRegistry));
        escrow.setSubmissionVerifier(address(campaignManager)); // For testing
        
        // Setup public signals
        validPublicSignals = new uint256[](2);
        validPublicSignals[0] = 123456;
        validPublicSignals[1] = 789012;
        
        // Fund company
        vm.deal(company, 100 ether);
    }
    
    function testCreateCampaign() public {
        uint256 pricePerSubmission = 1 ether;
        uint256 budget = 10 ether;
        uint256 deadline = block.timestamp + 30 days;
        string memory filecoinCID = "QmTest123";
        bytes32 metadataHash = keccak256("campaign-metadata");
        bytes32 constraintsHash = keccak256("constraints");
        
        vm.prank(company);
        vm.expectEmit(true, true, false, true);
        emit CampaignCreated(1, company, pricePerSubmission, budget, deadline);
        
        uint256 campaignId = campaignManager.createCampaign{value: budget}(
            filecoinCID,
            metadataHash,
            pricePerSubmission,
            30, // 30 days collection
            deadline,
            constraintsHash
        );
        
        assertEq(campaignId, 1);
        
        CampaignManager.Campaign memory campaign = campaignManager.getCampaign(campaignId);
        assertEq(campaign.company, company);
        assertEq(campaign.pricePerSubmission, pricePerSubmission);
        assertEq(campaign.totalBudget, budget);
        assertEq(campaign.deadline, deadline);
        assertTrue(campaign.active);
    }
    
    function testCannotCreateCampaignWithInvalidDeadline() public {
        vm.prank(company);
        vm.expectRevert(CampaignManager.InvalidDeadline.selector);
        campaignManager.createCampaign{value: 10 ether}(
            "QmTest",
            keccak256("metadata"),
            1 ether,
            30,
            block.timestamp - 1, // Past deadline
            keccak256("constraints")
        );
    }
    
    function testCannotCreateCampaignWithZeroPrice() public {
        vm.prank(company);
        vm.expectRevert(CampaignManager.InvalidPrice.selector);
        campaignManager.createCampaign{value: 10 ether}(
            "QmTest",
            keccak256("metadata"),
            0, // Zero price
            30,
            block.timestamp + 30 days,
            keccak256("constraints")
        );
    }
    
    function testCannotCreateCampaignWithInsufficientBudget() public {
        vm.prank(company);
        vm.expectRevert(CampaignManager.InsufficientBudget.selector);
        campaignManager.createCampaign{value: 0.5 ether}(
            "QmTest",
            keccak256("metadata"),
            1 ether, // Price higher than budget
            30,
            block.timestamp + 30 days,
            keccak256("constraints")
        );
    }
    
    function testDeactivateCampaign() public {
        uint256 campaignId = createTestCampaign();
        
        vm.prank(company);
        campaignManager.deactivateCampaign(campaignId);
        
        CampaignManager.Campaign memory campaign = campaignManager.getCampaign(campaignId);
        assertFalse(campaign.active);
    }
    
    function testIncrementSubmissionCount() public {
        uint256 campaignId = createTestCampaign();
        
        campaignManager.incrementSubmissionCount(campaignId);
        
        CampaignManager.Campaign memory campaign = campaignManager.getCampaign(campaignId);
        assertEq(campaign.submissionCount, 1);
    }
    
    function testGetTotalCampaigns() public {
        assertEq(campaignManager.getTotalCampaigns(), 0);
        
        createTestCampaign();
        assertEq(campaignManager.getTotalCampaigns(), 1);
        
        createTestCampaign();
        assertEq(campaignManager.getTotalCampaigns(), 2);
    }
    
    // Helper function
    function createTestCampaign() internal returns (uint256) {
        vm.prank(company);
        return campaignManager.createCampaign{value: 10 ether}(
            "QmTest",
            keccak256("campaign-metadata"),
            1 ether,
            30,
            block.timestamp + 30 days,
            keccak256("constraints")
        );
    }
}
