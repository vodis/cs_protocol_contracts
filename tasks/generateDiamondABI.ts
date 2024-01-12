const fs = require("fs");

import { task } from "hardhat/config";
import { AbiCoder } from "@ethersproject/abi";

const basePath = "/contracts/facets/";
const sharedLibraryBasePath = "/contracts/libraries/";

task("diamondABI", "Generates ABI file for diamond, includes all ABIs of facets").setAction(async () => {
  let files = fs.readdirSync("." + basePath);
  let abi: AbiCoder[] = [];
  for (const file of files) {
    const facetsFromFile = fs.readdirSync(`./artifacts${basePath}${file}`);

    for (const facet of facetsFromFile) {
      const jsonFile2 = facet.replace("sol", "json");
      if (file == "market") {
        const marketFacets = fs.readdirSync(`./artifacts${basePath}/market/${facet}`);
        for (const marketFacet of marketFacets) {
          const jsonMarketFacet = marketFacet.replace("sol", "json");
          let json = fs.readFileSync(`./artifacts${basePath}${file}/${facet}/${marketFacet}/${jsonMarketFacet}`);

          json = JSON.parse(json);
          abi.push(...json.abi);
        }
      } else {
        let json = fs.readFileSync(`./artifacts${basePath}${file}/${facet}/${jsonFile2}`);
        json = JSON.parse(json);
        abi.push(...json.abi);
      }
    }
  }

  files = fs.readdirSync("." + sharedLibraryBasePath);
  for (const file of files) {
    const jsonFile = file.replace("sol", "json");
    let json = fs.readFileSync(`./artifacts/${sharedLibraryBasePath}${file}/${jsonFile}`);
    json = JSON.parse(json);
    abi.push(...json.abi);
  }
  let finalAbi = JSON.stringify(abi);
  fs.writeFileSync("./abi/diamond/diamond.json", finalAbi);
  console.log("ABI written to diamond.json");
});
