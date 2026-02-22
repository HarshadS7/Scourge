// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/IdentityNFT.sol";
import "../src/IdentityRegistry.sol";
import "../src/MockGroth16Verifier.sol";

contract IdentityRegistryTest is Test {
    IdentityNFT public identityNFT;
    IdentityRegistry public identityRegistry;
    MockGroth16Verifier public verifier;
    
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    
    // Sample proof data for testing
    uint256[8] public validProof = [
        uint256(1), uint256(2), uint256(3), uint256(4),
        uint256(5), uint256(6), uint256(7), uint256(8)
    ];
    
    uint256[] public validPublicSignals;
    
    event IdentityRegistered(address indexed user, bytes32 indexed nullifier, uint256 tokenId);
    
    function setUp() public {
        // Deploy contracts
        verifier = new MockGroth16Verifier(true); // Always verify for testing
        identityNFT = new IdentityNFT();
        identityRegistry = new IdentityRegistry(address(identityNFT), address(verifier));
        
        // Set registry address in NFT contract
        identityNFT.setIdentityRegistry(address(identityRegistry));
        
        // Setup public signals
        validPublicSignals = new uint256[](2);
        validPublicSignals[0] = 123456;
        validPublicSignals[1] = 789012;
    }
    
    function testRegisterIdentity() public {
        bytes32 nullifier = keccak256(abi.encodePacked("user1-secret"));
        
        vm.prank(user1);
        vm.expectEmit(true, true, false, true);
        emit IdentityRegistered(user1, nullifier, 1);
        
        identityRegistry.registerIdentity(validProof, nullifier, validPublicSignals);
        
        // Verify registration
        assertTrue(identityRegistry.hasVerifiedIdentity(user1));
        assertTrue(identityNFT.hasIdentity(user1));
        assertTrue(identityRegistry.isNullifierUsed(nullifier));
    }
    
    function testCannotRegisterTwice() public {
        bytes32 nullifier = keccak256(abi.encodePacked("user1-secret"));
        
        vm.startPrank(user1);
        identityRegistry.registerIdentity(validProof, nullifier, validPublicSignals);
        
        // Try to register again
        vm.expectRevert(IdentityRegistry.AlreadyRegistered.selector);
        identityRegistry.registerIdentity(validProof, nullifier, validPublicSignals);
        vm.stopPrank();
    }
    
    function testCannotReuseNullifier() public {
        bytes32 nullifier = keccak256(abi.encodePacked("shared-nullifier"));
        
        // User1 registers
        vm.prank(user1);
        identityRegistry.registerIdentity(validProof, nullifier, validPublicSignals);
        
        // User2 tries to use same nullifier
        vm.prank(user2);
        vm.expectRevert(IdentityRegistry.NullifierAlreadyUsed.selector);
        identityRegistry.registerIdentity(validProof, nullifier, validPublicSignals);
    }
    
    function testInvalidProofFails() public {
        bytes32 nullifier = keccak256(abi.encodePacked("user1-secret"));
        
        // Set verifier to reject proofs
        verifier.setAlwaysVerify(false);
        
        vm.prank(user1);
        vm.expectRevert(IdentityRegistry.ProofVerificationFailed.selector);
        identityRegistry.registerIdentity(validProof, nullifier, validPublicSignals);
    }
    
    function testFuzzNullifierUniqueness(bytes32 nullifier1, bytes32 nullifier2) public {
        vm.assume(nullifier1 != nullifier2);
        
        // Register with first nullifier
        vm.prank(user1);
        identityRegistry.registerIdentity(validProof, nullifier1, validPublicSignals);
        
        // Register with different nullifier should fail (already registered)
        vm.prank(user1);
        vm.expectRevert(IdentityRegistry.AlreadyRegistered.selector);
        identityRegistry.registerIdentity(validProof, nullifier2, validPublicSignals);
        
        // Different user can register with different nullifier
        vm.prank(user2);
        identityRegistry.registerIdentity(validProof, nullifier2, validPublicSignals);
        
        assertTrue(identityRegistry.isNullifierUsed(nullifier1));
        assertTrue(identityRegistry.isNullifierUsed(nullifier2));
    }
}
