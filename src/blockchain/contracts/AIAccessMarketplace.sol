// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AIAccessMarketplace is Ownable(msg.sender) {
    struct Listing {
        address seller;
        uint256 price;
    }

    IERC721 public immutable aiAccessNFT;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => string) public tokenMetadataURI;

    constructor(address nftAddress) {
        aiAccessNFT = IERC721(nftAddress);
    }

    function list(uint256 tokenId, uint256 price) external {
        require(aiAccessNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be > 0");

        aiAccessNFT.transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing(msg.sender, price);
    }

    function buy(uint256 tokenId) external payable {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        delete listings[tokenId];
        payable(listing.seller).transfer(listing.price);
        aiAccessNFT.transferFrom(address(this), msg.sender, tokenId);

        emit Bought(tokenId, msg.sender, listing.price);
    }

    function setTokenMetadataURI(uint256 tokenId, string calldata uri) external onlyOwner {
        tokenMetadataURI[tokenId] = uri;
    }

    function getTokenMetadataURI(uint256 tokenId) external view returns (string memory) {
        return tokenMetadataURI[tokenId];
    }

    event Bought(uint256 indexed tokenId, address indexed buyer, uint256 price);
}
