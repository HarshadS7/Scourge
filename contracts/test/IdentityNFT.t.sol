// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/IdentityNFT.sol";
import "../src/IdentityRegistry.sol";
import "../src/MockGroth16Verifier.sol";

contract IdentityNFTTest is Test {
    IdentityNFT public identityNFT;
    IdentityRegistry public identityRegistry;
    MockGroth16Verifier public verifier;
    
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    
    function setUp() public {
        verifier = new MockGroth16Verifier(true);
        identityNFT = new IdentityNFT();
        identityRegistry = new IdentityRegistry(address(identityNFT), address(verifier));
        
        identityNFT.setIdentityRegistry(address(identityRegistry));
    }
    
    function testMintOnlyByRegistry() public {
        // Only registry can mint
        vm.prank(address(identityRegistry));
        uint256 tokenId = identityNFT.mint(user1);
        
        assertEq(tokenId, 1);
        assertEq(identityNFT.balanceOf(user1), 1);
    }
    
    function testCannotMintDirectly() public {
        vm.prank(user1);
        vm.expectRevert(IdentityNFT.OnlyIdentityRegistry.selector);
        identityNFT.mint(user1);
    }
    
    function testTokenIsSoulbound() public {
        vm.prank(address(identityRegistry));
        identityNFT.mint(user1);
        
        // Cannot transfer
        vm.prank(user1);
        vm.expectRevert(IdentityNFT.TokenIsSoulbound.selector);
        identityNFT.transferFrom(user1, user2, 1);
    }
    
    function testCannotApprove() public {
        vm.prank(address(identityRegistry));
        identityNFT.mint(user1);
        
        vm.prank(user1);
        vm.expectRevert(IdentityNFT.TokenIsSoulbound.selector);
        identityNFT.approve(user2, 1);
    }
    
    function testCannotSetApprovalForAll() public {
        vm.prank(user1);
        vm.expectRevert(IdentityNFT.TokenIsSoulbound.selector);
        identityNFT.setApprovalForAll(user2, true);
    }
    
    function testHasIdentity() public {
        assertFalse(identityNFT.hasIdentity(user1));
        
        vm.prank(address(identityRegistry));
        identityNFT.mint(user1);
        
        assertTrue(identityNFT.hasIdentity(user1));
    }
    
    function testTokenIdIncrement() public {
        vm.startPrank(address(identityRegistry));
        
        uint256 tokenId1 = identityNFT.mint(user1);
        uint256 tokenId2 = identityNFT.mint(user2);
        
        assertEq(tokenId1, 1);
        assertEq(tokenId2, 2);
        
        vm.stopPrank();
    }
}
