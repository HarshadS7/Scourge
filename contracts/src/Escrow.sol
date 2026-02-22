// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Escrow
 * @notice Manages escrow funds for data marketplace campaigns
 * @dev Holds funds until valid submission or deadline expiry
 */
contract Escrow is Ownable, ReentrancyGuard {
    struct EscrowDeposit {
        address depositor;
        uint256 amount;
        uint256 remainingBudget;
        uint256 deadline;
        bool active;
    }
    
    // Mapping from campaign ID to escrow deposit
    mapping(uint256 => EscrowDeposit) public deposits;
    
    // Address of the SubmissionVerifier contract
    address public submissionVerifier;
    
    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee;
    
    // Platform fee recipient
    address public feeRecipient;
    
    error InsufficientDeposit();
    error InsufficientBudget();
    error CampaignNotActive();
    error DeadlineNotPassed();
    error OnlySubmissionVerifier();
    error InvalidFee();
    
    event Deposited(uint256 indexed campaignId, address indexed depositor, uint256 amount);
    event Released(uint256 indexed campaignId, address indexed recipient, uint256 amount, uint256 fee);
    event Refunded(uint256 indexed campaignId, address indexed depositor, uint256 amount);
    
    modifier onlyVerifier() {
        if (msg.sender != submissionVerifier) revert OnlySubmissionVerifier();
        _;
    }
    
    constructor(address _feeRecipient, uint256 _platformFee) Ownable(msg.sender) {
        if (_platformFee > 1000) revert InvalidFee(); // Max 10%
        feeRecipient = _feeRecipient;
        platformFee = _platformFee;
    }
    
    /**
     * @notice Set the SubmissionVerifier contract address
     * @param _verifier Address of the SubmissionVerifier contract
     */
    function setSubmissionVerifier(address _verifier) external onlyOwner {
        submissionVerifier = _verifier;
    }
    
    /**
     * @notice Update platform fee
     * @param _newFee New fee in basis points (max 1000 = 10%)
     */
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        if (_newFee > 1000) revert InvalidFee();
        platformFee = _newFee;
    }
    
    /**
     * @notice Update fee recipient
     * @param _newRecipient New fee recipient address
     */
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        feeRecipient = _newRecipient;
    }
    
    /**
     * @notice Deposit funds for a campaign
     * @param campaignId The campaign ID
     * @param totalBudget Total budget for the campaign
     * @param deadline Campaign deadline timestamp
     */
    function deposit(
        uint256 campaignId,
        uint256 totalBudget,
        uint256 deadline
    ) external payable {
        if (msg.value < totalBudget) revert InsufficientDeposit();
        
        deposits[campaignId] = EscrowDeposit({
            depositor: msg.sender,
            amount: msg.value,
            remainingBudget: msg.value,
            deadline: deadline,
            active: true
        });
        
        emit Deposited(campaignId, msg.sender, msg.value);
    }
    
    /**
     * @notice Release payment to a user for valid submission
     * @param campaignId The campaign ID
     * @param recipient The recipient of the payment
     * @param amount Amount to release
     */
    function release(
        uint256 campaignId,
        address recipient,
        uint256 amount
    ) external onlyVerifier nonReentrant {
        EscrowDeposit storage escrowDeposit = deposits[campaignId];
        
        if (!escrowDeposit.active) revert CampaignNotActive();
        if (escrowDeposit.remainingBudget < amount) revert InsufficientBudget();
        
        // Calculate platform fee
        uint256 fee = (amount * platformFee) / 10000;
        uint256 userAmount = amount - fee;
        
        // Update remaining budget
        escrowDeposit.remainingBudget -= amount;
        
        // Transfer funds
        (bool success1, ) = payable(recipient).call{value: userAmount}("");
        require(success1, "Transfer to recipient failed");
        
        if (fee > 0) {
            (bool success2, ) = payable(feeRecipient).call{value: fee}("");
            require(success2, "Transfer to fee recipient failed");
        }
        
        emit Released(campaignId, recipient, userAmount, fee);
    }
    
    /**
     * @notice Refund remaining budget after deadline
     * @param campaignId The campaign ID
     */
    function refund(uint256 campaignId) external nonReentrant {
        EscrowDeposit storage escrowDeposit = deposits[campaignId];
        
        if (!escrowDeposit.active) revert CampaignNotActive();
        if (block.timestamp < escrowDeposit.deadline) revert DeadlineNotPassed();
        
        uint256 refundAmount = escrowDeposit.remainingBudget;
        escrowDeposit.remainingBudget = 0;
        escrowDeposit.active = false;
        
        (bool success, ) = payable(escrowDeposit.depositor).call{value: refundAmount}("");
        require(success, "Refund failed");
        
        emit Refunded(campaignId, escrowDeposit.depositor, refundAmount);
    }
    
    /**
     * @notice Get remaining budget for a campaign
     * @param campaignId The campaign ID
     * @return uint256 Remaining budget
     */
    function getRemainingBudget(uint256 campaignId) external view returns (uint256) {
        return deposits[campaignId].remainingBudget;
    }
    
    /**
     * @notice Check if a campaign is active
     * @param campaignId The campaign ID
     * @return bool True if campaign is active
     */
    function isCampaignActive(uint256 campaignId) external view returns (bool) {
        return deposits[campaignId].active && 
               block.timestamp < deposits[campaignId].deadline &&
               deposits[campaignId].remainingBudget > 0;
    }
}
