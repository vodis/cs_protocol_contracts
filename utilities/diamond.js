const fs = require("fs");
const path = require('path');

async function deployFacets(facets, cutAction) {
  const cut = [];
  for (const facet of facets) {
    const facetFactory = await ethers.getContractFactory(facet)
    const deployedFactory = await facetFactory.deploy()
    await deployedFactory.deployed()

    console.log(facet," deployed at adress : ",deployedFactory.address)
    const saveContract = { [facet]: deployedFactory.address }

    updateContractAddresses(
      saveContract,
      network
    );

    cut.push({
      facetAddress: deployedFactory.address,
      action: cutAction,
      functionSelectors: getSelectors(facetFactory),
    });
  }
  return cut
}

const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

async function updateContractAddresses(contractAddresses = {}, network) {
  try {
    const dataInFile = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'),
    );

    for (const property in contractAddresses) {
      dataInFile[network.name][property] = contractAddresses[property];
    }
    fs.writeFileSync(
      path.resolve(__dirname, '../config.json'),
      JSON.stringify(dataInFile),
    );
  } catch (error) {
    console.log('error ', error);
  }
}

// Get function selectors from ABI
function getSelectors(contract) {
  const signatures = Object.keys(contract.interface.functions)
  const selectors = signatures.reduce((acc, val) => {
    if (val !== 'init(bytes)') {
      acc.push(contract.interface.getSighash(val))
    }
    return acc
  }, [])
  selectors.contract = contract
  selectors.remove = remove
  selectors.get = get
  return selectors
}

// Used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove(functionNames) {
  const selectors = this.filter((v) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return false
      }
    }
    return true
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

// Used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get(functionNames) {
  const selectors = this.filter((v) => {
    for (const functionName of functionNames) {
      if (v === this.contract.interface.getSighash(functionName)) {
        return true
      }
    }
    return false
  })
  selectors.contract = this.contract
  selectors.remove = this.remove
  selectors.get = this.get
  return selectors
}

module.exports = {
  deployFacets,
  FacetCutAction,
}