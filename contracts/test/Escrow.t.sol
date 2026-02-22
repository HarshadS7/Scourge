// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Escrow.sol";
import "../src/SubmissionVerifier.sol";

contract EscrowTest is Test {
    Escrow public escrow;
    
    address public company = address(0x1);
    address public user = address(0x2);
    address public feeRecipient = address(0x3);
    address public verifier = address(0x4);
    
    uint256 public constant PLATFORM_FEE = 250; // 2.5%
    
    event Deposited(uint256 indexed campaignId, address indexed depositor, uint256 amount);
    event Released(uint256 indexed campaignId, address indexed recipient, uint256 amount, uint256 fee);
    event Refunded(uint256 indexed campaignId, address indexed depositor, uint256 amount);
    
    function setUp() public {
        escrow = new Escrow(feeRecipient, PLATFORM_FEE);
        escrow.setSubmissionVerifier(verifier);
        
        // Fund company
        vm.deal(company, 100 ether);
    }
    
    function testDeposit() public {
        uint256 campaignId = 1;
        uint256 budget = 10 ether;
        uint256 deadline = block.timestamp + 30 days;
        
        vm.prank(company);
        vm.expectEmit(true, true, false, true);
        emit Deposited(campaignId, company, budget);
        
        escrow.deposit{value: budget}(campaignId, budget, deadline);
        
        assertEq(escrow.getRemainingBudget(campaignId), budget);
        assertTrue(escrow.isCampaignActive(campaignId));
    }
    
    function testRelease() public {
        uint256 campaignId = 1;
        uint256 budget = 10 ether;
        uint256 deadline = block.timestamp + 30 days;
        uint256 paymentAmount = 1 ether;
        
        // Deposit
        vm.prank(company);
        escrow.deposit{value: budget}(campaignId, budget, deadline);
        
        // Release payment
        uint256 expectedFee = (paymentAmount * PLATFORM_FEE) / 10000;
        uint256 expectedUserAmount = paymentAmount - expectedFee;
        
        uint256 userBalanceBefore = user.balance;
        uint256 feeRecipientBalanceBefore = feeRecipient.balance;
        
        vm.prank(verifier);
        vm.expectEmit(true, true, false, true);
        emit Released(campaignId, user, expectedUserAmount, expectedFee);
        
        escrow.release(campaignId, user, paymentAmount);
        
        assertEq(user.balance - userBalanceBefore, expectedUserAmount);
        assertEq(feeRecipient.balance - feeRecipientBalanceBefore, expectedFee);
        assertEq(escrow.getRemainingBudget(campaignId), budget - paymentAmount);
    }
    
    function testOnlyVerifierCanRelease() public {
        uint256 campaignId = 1;
        uint256 budget = 10 ether;
        uint256 deadline = block.timestamp + 30 days;
        
        vm.prank(company);
        escrow.deposit{value: budget}(campaignId, budget, deadline);
        
        // Non-verifier cannot release
        vm.prank(company);
        vm.expectRevert(Escrow.OnlySubmissionVerifier.selector);
        escrow.release(campaignId, user, 1 ether);
    }
    
    function testRefundAfterDeadline() public {
        uint256 campaignId = 1;
        uint256 budget = 10 ether;
        uint256 deadline = block.timestamp + 30 days;
        
        vm.prank(company);
        escrow.deposit{value: budget}(campaignId, budget, deadline);
        
        // Cannot refund before deadline
        vm.expectRevert(Escrow.DeadlineNotPassed.selector);
        escrow.refund(campaignId);
        
        // Warp past deadline
        vm.warp(deadline + 1);
        
        uint256 companyBalanceBefore = company.balance;
        
        vm.expectEmit(true, true, false, true);
        emit Refunded(campaignId, company, budget);
        
        escrow.refund(campaignId);
        
        assertEq(company.balance - companyBalanceBefore, budget);
        assertEq(escrow.getRemainingBudget(campaignId), 0);
        assertFalse(escrow.isCampaignActive(campaignId));
    }
    
    function testCannotReleaseInsufficientBudget() public {
        uint256 campaignId = 1;
        uint256 budget = 1 ether;
        uint256 deadline = block.timestamp + 30 days;
        
        vm.prank(company);
        escrow.deposit{value: budget}(campaignId, budget, deadline);
        
        vm.prank(verifier);
        vm.expectRevert(Escrow.InsufficientBudget.selector);
        escrow.release(campaignId, user, budget + 1);
    }
    
    function testInvalidFee() public {
        vm.expectRevert(Escrow.InvalidFee.selector);
        new Escrow(feeRecipient, 1001); // > 10%
    }
    
    function testFuzzDeposit(uint256 budget, uint256 timeOffset) public {
        budget = bound(budget, 0.1 ether, 1000 ether);
        timeOffset = bound(timeOffset, 1 days, 365 days);
        
        uint256 campaignId = 1;
        uint256 deadline = block.timestamp + timeOffset;
        
        vm.deal(company, budget);
        vm.prank(company);
        escrow.deposit{value: budget}(campaignId, budget, deadline);
        
        assertEq(escrow.getRemainingBudget(campaignId), budget);
    }
}
