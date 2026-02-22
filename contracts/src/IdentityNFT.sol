// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IdentityNFT
 * @notice Soulbound NFT representing verified unique human identities
 * @dev Non-transferable token minted after ZK identity proof verification
 */
contract IdentityNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to whether it's soulbound (always true for this contract)
    mapping(uint256 => bool) public isSoulbound;
    
    // Address of the IdentityRegistry that can mint tokens
    address public identityRegistry;
    
    error TokenIsSoulbound();
    error OnlyIdentityRegistry();
    error TokenDoesNotExist();
    
    event IdentityMinted(address indexed user, uint256 indexed tokenId);
    
    modifier onlyRegistry() {
        if (msg.sender != identityRegistry) revert OnlyIdentityRegistry();
        _;
    }
    
    constructor() ERC721("MonadBlitz Identity", "MBID") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from 1
    }
    
    /**
     * @notice Set the IdentityRegistry contract address
     * @param _registry Address of the IdentityRegistry contract
     */
    function setIdentityRegistry(address _registry) external onlyOwner {
        identityRegistry = _registry;
    }
    
    /**
     * @notice Mint a soulbound identity NFT to a user
     * @param to Address to mint the NFT to
     * @return tokenId The ID of the minted token
     */
    function mint(address to) external onlyRegistry returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        isSoulbound[tokenId] = true;
        
        emit IdentityMinted(to, tokenId);
        return tokenId;
    }
    
    /**
     * @notice Check if a user has an identity NFT
     * @param user Address to check
     * @return bool True if user has an identity NFT
     */
    function hasIdentity(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }
    
    /**
     * @notice Override transfer functions to make tokens non-transferable
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) but not transfers
        if (from != address(0) && to != address(0)) {
            revert TokenIsSoulbound();
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @notice Override approve to prevent approvals
     */
    function approve(address, uint256) public pure override {
        revert TokenIsSoulbound();
    }
    
    /**
     * @notice Override setApprovalForAll to prevent approvals
     */
    function setApprovalForAll(address, bool) public pure override {
        revert TokenIsSoulbound();
    }
}
