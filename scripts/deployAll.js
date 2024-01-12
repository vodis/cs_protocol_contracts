const hre = require("hardhat");
const fs = require("fs");
const { deployFacets, FacetCutAction } = require("../utilities/diamond");

const ethers = hre.ethers;

async function deployAll() {
  const [supperAdmin] = await ethers.getSigners();
  const chainId = await supperAdmin.getChainId();
  console.log("supperAdmin", supperAdmin.address);

  // Deploying the diamond
  const diamond = await hre.ethers.getContractFactory("Diamond");

  // Diamond constructor have one arg: Owner
  const CSDiamond = await diamond.deploy(supperAdmin.address);
  await CSDiamond.deployed();
  console.log("CSDiamond", CSDiamond.address);
  
  const diamondCut = await hre.ethers.getContractAt(
    "DiamondCut",
    CSDiamond.address
  );
  console.log("diamondCut", diamondCut.address);

  const facetNames = [];

  const cut = await deployFacets(facetNames, FacetCutAction.Add);

  // Add facets functions to the diamond
  await diamondCut.diamondCut(
    cut,
    hre.ethers.constants.AddressZero,
    "0x"
  );
}

deployAll().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});