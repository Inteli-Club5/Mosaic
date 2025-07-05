// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIAccessNFT is ERC721Burnable, Ownable(msg.sender) {
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public expirationTime;

    constructor() ERC721("AIAccessNFT", "AIANFT") {}

    function mint(address to, uint256 durationInSeconds) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        expirationTime[tokenId] = block.timestamp + durationInSeconds;
    }

    function useAgent(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not your NFT");

        if (block.timestamp > expirationTime[tokenId]) {
            _burn(tokenId);
            emit AgentExpiredAndBurned(tokenId, msg.sender);
            return;
        }

        emit AgentUsed(tokenId, msg.sender);
    }

    event AgentUsed(uint256 indexed tokenId, address indexed user);
    event AgentExpiredAndBurned(uint256 indexed tokenId, address indexed user);
}
