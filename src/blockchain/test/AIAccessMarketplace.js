const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIAccessMarketplace", function () {
    let NFT, nft, Stablecoin, stablecoin, Marketplace, marketplace;
    let owner, seller, buyer;

    beforeEach(async function () {
        [owner, seller, buyer] = await ethers.getSigners();

        NFT = await ethers.getContractFactory("AIAccessNFT");
        nft = await NFT.deploy();
        await nft.waitForDeployment();

        await nft.connect(owner).mint(seller.address, 7 * 24 * 60 * 60);

        Stablecoin = await ethers.getContractFactory("TestERC20");
        stablecoin = await Stablecoin.deploy("Mock Stablecoin", "MSC", ethers.parseEther("1000000"));
        await stablecoin.waitForDeployment();

        await stablecoin.connect(owner).transfer(buyer.address, ethers.parseEther("100"));

        Marketplace = await ethers.getContractFactory("AIAccessMarketplace");
        marketplace = await Marketplace.deploy(nft.target, stablecoin.target);
        await marketplace.waitForDeployment();

        await nft.connect(seller).approve(marketplace.target, 0);
    });

    it("should allow listing an NFT", async function () {
        const price = ethers.parseEther("1");
        await expect(
            marketplace.connect(seller).list(0, price)
        ).to.not.be.reverted;

        expect(await nft.ownerOf(0)).to.equal(await ethers.resolveAddress(marketplace.target));

        const listing = await marketplace.listings(0);
        expect(listing.seller).to.equal(seller.address);
        expect(listing.price).to.equal(price);
    });

    it("should not allow listing NFT if not owner", async function () {
        await expect(
            marketplace.connect(buyer).list(0, ethers.parseEther("1"))
        ).to.be.revertedWith("Not the owner");
    });

    it("should not allow listing with zero price", async function () {
        await expect(
            marketplace.connect(seller).list(0, 0)
        ).to.be.revertedWith("Price must be > 0");
    });

    it("should allow buying a listed NFT with stablecoin", async function () {
        const listingPrice = ethers.parseEther("1");
        await marketplace.connect(seller).list(0, listingPrice);

        await stablecoin.connect(buyer).approve(marketplace.target, listingPrice);

        const sellerStablecoinBalanceBefore = await stablecoin.balanceOf(seller.address);
        const buyerStablecoinBalanceBefore = await stablecoin.balanceOf(buyer.address);

        await expect(
            marketplace.connect(buyer).buy(0)
        )
            .to.emit(marketplace, "Bought")
            .withArgs(0, buyer.address, listingPrice);

        expect(await nft.ownerOf(0)).to.equal(buyer.address);

        const sellerStablecoinBalanceAfter = await stablecoin.balanceOf(seller.address);
        const buyerStablecoinBalanceAfter = await stablecoin.balanceOf(buyer.address);

        expect(sellerStablecoinBalanceAfter).to.equal(sellerStablecoinBalanceBefore + listingPrice);
        expect(buyerStablecoinBalanceAfter).to.equal(buyerStablecoinBalanceBefore - listingPrice);

        const listing = await marketplace.listings(0);
        expect(listing.price).to.equal(0);
    });

    it("should not allow buying with insufficient stablecoin allowance", async function () {
        const listingPrice = ethers.parseEther("1");
        await marketplace.connect(seller).list(0, listingPrice);

        await stablecoin.connect(buyer).approve(marketplace.target, ethers.parseEther("0.5"));

        await expect(
            marketplace.connect(buyer).buy(0)
        ).to.be.revertedWithCustomError(stablecoin, "ERC20InsufficientAllowance");
    });

    it("should not allow buying with insufficient stablecoin balance", async function () {
        const listingPrice = ethers.parseEther("150");
        await marketplace.connect(seller).list(0, listingPrice);

        await stablecoin.connect(buyer).approve(marketplace.target, listingPrice);

        await expect(
            marketplace.connect(buyer).buy(0)
        ).to.be.revertedWithCustomError(stablecoin, "ERC20InsufficientBalance");
    });

    it("should not allow buying a non-listed NFT", async function () {
        await expect(
            marketplace.connect(buyer).buy(1)
        ).to.be.revertedWith("Not listed");
    });

    it("should allow setting token metadata URI by owner", async function () {
        const testURI = "arweave://testTxId123";

        await expect(marketplace.connect(owner).setTokenMetadataURI(0, testURI))
            .to.not.be.reverted;

        const uri = await marketplace.getTokenMetadataURI(0);
        expect(uri).to.equal(testURI);
    });

    it("should not allow non-owner to set token metadata URI", async function () {
        const testURI = "arweave://testTxId123";

        await expect(
            marketplace.connect(seller).setTokenMetadataURI(0, testURI)
        ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");
    });

    it("should retrieve an empty string if metadata URI is not set", async function () {
        const uri = await marketplace.getTokenMetadataURI(0);
        expect(uri).to.equal("");
    });

    it("should allow a seller to cancel a listing", async function () {
        const price = ethers.parseEther("1");
        await marketplace.connect(seller).list(0, price);

        expect(await nft.ownerOf(0)).to.equal(await ethers.resolveAddress(marketplace.target));

        await expect(marketplace.connect(seller).cancelListing(0))
            .to.not.be.reverted;

        expect(await nft.ownerOf(0)).to.equal(seller.address);

        const listing = await marketplace.listings(0);
        expect(listing.price).to.equal(0);
    });

    it("should not allow non-seller to cancel a listing", async function () {
        const price = ethers.parseEther("1");
        await marketplace.connect(seller).list(0, price);

        await expect(marketplace.connect(buyer).cancelListing(0))
            .to.be.revertedWith("Not seller of this listing");
    });

    it("should not allow canceling a non-existent listing", async function () {
        await expect(marketplace.connect(seller).cancelListing(1))
            .to.be.revertedWith("Not seller of this listing");
    });
});