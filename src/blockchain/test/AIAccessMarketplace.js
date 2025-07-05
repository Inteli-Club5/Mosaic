const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIAccessMarketplace", function () {
  let NFT, nft, Marketplace, marketplace;
  let owner, seller, buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    NFT = await ethers.getContractFactory("AIAccessNFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment(); 

    await nft.connect(owner).mint(seller.address, 7 * 24 * 60 * 60);

    Marketplace = await ethers.getContractFactory("AIAccessMarketplace");
    marketplace = await Marketplace.deploy(nft.target);
    await marketplace.waitForDeployment();

    await nft.connect(seller).approve(marketplace.target, 0);
  });

  it("should allow listing an NFT", async function () {
    await expect(
        marketplace.connect(seller).list(0, ethers.parseEther("1"))
    ).to.not.be.reverted;

    expect(await nft.ownerOf(0)).to.equal(await ethers.resolveAddress(marketplace.target));
    const listing = await marketplace.listings(0);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.price).to.equal(ethers.parseEther("1"));
  });

  it("should allow setting and retrieving token metadata URI", async function () {
    const testURI = "arweave://testTxId123";

    await expect(
      marketplace.connect(seller).setTokenMetadataURI(0, testURI)
    ).to.be.revertedWithCustomError(marketplace, "OwnableUnauthorizedAccount");

    await expect(marketplace.connect(owner).setTokenMetadataURI(0, testURI))
      .to.not.be.reverted;

    const uri = await marketplace.getTokenMetadataURI(0);
    expect(uri).to.equal(testURI);
  });

  it("should allow buying a listed NFT", async function () {
    await marketplace.connect(seller).list(0, ethers.parseEther("1"));

    const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

    await expect(
      marketplace.connect(buyer).buy(0, { value: ethers.parseEther("1") })
    )
      .to.emit(marketplace, "Bought")
      .withArgs(0, buyer.address, ethers.parseEther("1"));

    expect(await nft.ownerOf(0)).to.equal(buyer.address);

    const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
    expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
  });

  it("should not allow buying with insufficient funds", async function () {
    await marketplace.connect(seller).list(0, ethers.parseEther("1"));

    await expect(
      marketplace.connect(buyer).buy(0, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Insufficient payment");
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
});