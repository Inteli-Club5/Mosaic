// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";

// Hedera Testnet

contract AIAccessMarketplace is Ownable(msg.sender) {
    struct Listing {
        address seller;
        uint256 price;
    }

    IERC721 public immutable aiAccessNFT;
    IERC20 public immutable stablecoin; 

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => string) public tokenMetadataURI;

    constructor(address nftAddress, address stablecoinAddress)
    {
        aiAccessNFT = IERC721(nftAddress);
        stablecoin = IERC20(stablecoinAddress); 
    }

    function list(uint256 tokenId, uint256 price) external {
        require(aiAccessNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be > 0");

        aiAccessNFT.transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing(msg.sender, price);
    }

    function buy(uint256 tokenId) external { 
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Not listed");

        bool sent = stablecoin.transferFrom(msg.sender, listing.seller, listing.price);
        require(sent, "Stablecoin transfer failed or insufficient allowance/balance");

        aiAccessNFT.transferFrom(address(this), msg.sender, tokenId);

        delete listings[tokenId];

        emit Bought(tokenId, msg.sender, listing.price);
    }

    function setTokenMetadataURI(uint256 tokenId, string calldata uri) external onlyOwner {
        tokenMetadataURI[tokenId] = uri;
    }

    function getTokenMetadataURI(uint256 tokenId) external view returns (string memory) {
        return tokenMetadataURI[tokenId];
    }

    function cancelListing(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not seller of this listing");
        require(listing.price > 0, "Listing does not exist");

        aiAccessNFT.transferFrom(address(this), msg.sender, tokenId);

        delete listings[tokenId];
    }

    event Bought(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed tokenId, address indexed seller);
}