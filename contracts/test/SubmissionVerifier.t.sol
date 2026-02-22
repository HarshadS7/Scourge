// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SubmissionVerifier.sol";
import "../src/IdentityRegistry.sol";
import "../src/IdentityNFT.sol";
import "../src/CampaignManager.sol";
import "../src/Escrow.sol";
import "../src/MockGroth16Verifier.sol";

contract SubmissionVerifierTest is Test {
    SubmissionVerifier public submissionVerifier;
    IdentityRegistry public identityRegistry;
    IdentityNFT public identityNFT;
    CampaignManager public campaignManager;
    Escrow public escrow;
    MockGroth16Verifier public verifier;
    
    address public company = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public feeRecipient = address(0x4);
    
    uint256[8] public validProof = [1, 2, 3, 4, 5, 6, 7, 8];
    uint256[] public validPublicSignals;
    
    event SubmissionVerified(
        uint256 indexed submissionId,
        uint256 indexed campaignId,
        address indexed submitter,
        string encryptedDataIPFSHash,
        uint256 payout
    );
    
    function setUp() public {
        // Deploy all contracts
        verifier = new MockGroth16Verifier(true);
        identityNFT = new IdentityNFT();
        identityRegistry = new IdentityRegistry(address(identityNFT), address(verifier));
        escrow = new Escrow(feeRecipient, 250); // 2.5% fee
        campaignManager = new CampaignManager(address(identityRegistry), address(escrow));
        submissionVerifier = new SubmissionVerifier(
            address(identityRegistry),
            address(campaignManager),
            address(escrow),
            address(verifier)
        );
        
        identityNFT.setIdentityRegistry(address(identityRegistry));
        escrow.setSubmissionVerifier(address(submissionVerifier));
        
        // Setup public signals
        validPublicSignals = new uint256[](2);
        validPublicSignals[0] = 123456;
        validPublicSignals[1] = 789012;
        
        // Fund accounts
        vm.deal(company, 100 ether);
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
        
        // Register users
        registerUser(user1, keccak256("user1-secret"));
        registerUser(user2, keccak256("user2-secret"));
    }
    
    function testSubmitData() public {
        uint256 campaignId = createTestCampaign();
        bytes32 campaignNullifier = keccak256(abi.encodePacked("user1-secret", campaignId));
        string memory ipfsHash = "QmEncryptedData123";
        
        uint256 userBalanceBefore = user1.balance;
        
        vm.prank(user1);
        vm.expectEmit(true, true, true, true);
        emit SubmissionVerified(1, campaignId, user1, ipfsHash, 1 ether);
        
        uint256 submissionId = submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            campaignNullifier,
            ipfsHash,
            validPublicSignals,
            validPublicSignals
        );
        
        assertEq(submissionId, 1);
        
        // Check payment received (minus platform fee)
        uint256 expectedPayment = 1 ether - (1 ether * 250) / 10000;
        assertEq(user1.balance - userBalanceBefore, expectedPayment);
        
        // Check nullifier marked as used
        assertTrue(submissionVerifier.isNullifierUsed(campaignNullifier));
    }
    
    function testCannotSubmitWithoutIdentity() public {
        uint256 campaignId = createTestCampaign();
        bytes32 campaignNullifier = keccak256("test");
        
        address unregisteredUser = address(0x99);
        
        vm.prank(unregisteredUser);
        vm.expectRevert(SubmissionVerifier.OnlyVerifiedIdentity.selector);
        submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            campaignNullifier,
            "QmTest",
            validPublicSignals,
            validPublicSignals
        );
    }
    
    function testCannotSubmitToInactiveCampaign() public {
        uint256 campaignId = 999; // Non-existent campaign
        bytes32 campaignNullifier = keccak256("test");
        
        vm.prank(user1);
        vm.expectRevert(SubmissionVerifier.CampaignNotActive.selector);
        submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            campaignNullifier,
            "QmTest",
            validPublicSignals,
            validPublicSignals
        );
    }
    
    function testCannotReuseNullifier() public {
        uint256 campaignId = createTestCampaign();
        bytes32 campaignNullifier = keccak256(abi.encodePacked("user1-secret", campaignId));
        
        // First submission
        vm.prank(user1);
        submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            campaignNullifier,
            "QmTest1",
            validPublicSignals,
            validPublicSignals
        );
        
        // Try to submit again with same nullifier
        vm.prank(user1);
        vm.expectRevert(SubmissionVerifier.NullifierAlreadyUsed.selector);
        submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            campaignNullifier,
            "QmTest2",
            validPublicSignals,
            validPublicSignals
        );
    }
    
    function testMultipleUsersCanSubmit() public {
        uint256 campaignId = createTestCampaign();
        
        bytes32 nullifier1 = keccak256(abi.encodePacked("user1-secret", campaignId));
        bytes32 nullifier2 = keccak256(abi.encodePacked("user2-secret", campaignId));
        
        // User1 submits
        vm.prank(user1);
        uint256 submissionId1 = submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            nullifier1,
            "QmUser1Data",
            validPublicSignals,
            validPublicSignals
        );
        
        // User2 submits
        vm.prank(user2);
        uint256 submissionId2 = submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            nullifier2,
            "QmUser2Data",
            validPublicSignals,
            validPublicSignals
        );
        
        assertEq(submissionId1, 1);
        assertEq(submissionId2, 2);
        
        // Check both nullifiers are used
        assertTrue(submissionVerifier.isNullifierUsed(nullifier1));
        assertTrue(submissionVerifier.isNullifierUsed(nullifier2));
    }
    
    function testInvalidIdentityProofFails() public {
        uint256 campaignId = createTestCampaign();
        bytes32 campaignNullifier = keccak256("test");
        
        // Set verifier to reject
        verifier.setAlwaysVerify(false);
        
        vm.prank(user1);
        vm.expectRevert(SubmissionVerifier.IdentityProofFailed.selector);
        submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            campaignNullifier,
            "QmTest",
            validPublicSignals,
            validPublicSignals
        );
    }
    
    function testGetSubmission() public {
        uint256 campaignId = createTestCampaign();
        bytes32 campaignNullifier = keccak256("test");
        string memory ipfsHash = "QmTest123";
        
        vm.prank(user1);
        uint256 submissionId = submissionVerifier.submitData(
            campaignId,
            validProof,
            validProof,
            campaignNullifier,
            ipfsHash,
            validPublicSignals,
            validPublicSignals
        );
        
        SubmissionVerifier.Submission memory submission = submissionVerifier.getSubmission(submissionId);
        
        assertEq(submission.submitter, user1);
        assertEq(submission.campaignId, campaignId);
        assertEq(submission.encryptedDataIPFSHash, ipfsHash);
        assertEq(submission.campaignNullifier, campaignNullifier);
        assertTrue(submission.verified);
    }
    
    // Helper functions
    function registerUser(address user, bytes32 nullifier) internal {
        vm.prank(user);
        identityRegistry.registerIdentity(validProof, nullifier, validPublicSignals);
    }
    
    function createTestCampaign() internal returns (uint256) {
        vm.prank(company);
        return campaignManager.createCampaign{value: 10 ether}(
            "QmCampaignAttributes",
            1 ether,
            30,
            block.timestamp + 30 days,
            keccak256("constraints")
        );
    }
}
