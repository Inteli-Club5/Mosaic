const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AIAccessNFT", function () {
  let AIAccessNFT, nft, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    AIAccessNFT = await ethers.getContractFactory("AIAccessNFT");
    nft = await AIAccessNFT.deploy();
  });

  it("should mint NFT with expiration", async function () {
    await nft.mint(user.address, 1000);
    expect(await nft.ownerOf(0)).to.equal(user.address);
    const exp = await nft.expirationTime(0);
    expect(exp).to.be.gt(0);
  });

  it("should allow useAgent before expiration", async function () {
    await nft.mint(user.address, 1000);
    await expect(nft.connect(user).useAgent(0))
      .to.emit(nft, "AgentUsed")
      .withArgs(0, user.address);
  });

  it("should burn if NFT expired", async function () {
    await nft.mint(user.address, 1);
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine");

    await expect(nft.connect(user).useAgent(0))
      .to.emit(nft, "AgentExpiredAndBurned")
      .withArgs(0, user.address);

    await expect(nft.ownerOf(0)).to.be.reverted;
  });


  it("should not allow others to use your NFT", async function () {
    await nft.mint(user.address, 1000);
    await expect(nft.useAgent(0)).to.be.revertedWith("Not your NFT");
  });
});