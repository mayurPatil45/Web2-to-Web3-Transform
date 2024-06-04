const solc = require("solc");
const fs = require("fs");
const path = require("path");

const compileContract = (fileName, contractName) => {
  // Read the Solidity source code from the file system
  const contractPath = path.join(__dirname, fileName);
  const sourceCode = fs.readFileSync(contractPath, "utf8");

  // solc compiler config
  const input = {
    language: "Solidity",
    sources: {
      [fileName]: {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  // Compile the Solidity code using solc
  const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
  console.log(compiledCode);

  // Get the bytecode and ABI from the compiled contract
  const bytecode = compiledCode.contracts[fileName][contractName].evm.bytecode.object;
  const abi = compiledCode.contracts[fileName][contractName].abi;

  // Write the bytecode to a new file
  const bytecodePath = path.join(__dirname, "MyContractBytecode.bin");
  fs.writeFileSync(bytecodePath, bytecode);

  // Write the Contract ABI to a new file
  const abiPath = path.join(__dirname, "MyContractAbi.json");
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, "\t"));

  // Log the compiled contract code to the console
  console.log("Contract Bytecode:\n", bytecode);
  console.log("Contract ABI:\n", abi);

  return { bytecode, abi };
};

// Usage
//const { bytecode, abi } = compileContract("Test.sol", "Greeter");

const { Web3 } = require("web3");

const provider = new Web3.providers.HttpProvider("https://rpc-sepolia.ethereum.com/");
const web3 = new Web3(provider);

const deployContract = async (bytecode, abi, privateKey) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  const contract = new web3.eth.Contract(abi);

  try {
    const deployment = contract.deploy({ data: bytecode });
    const gas = await deployment.estimateGas();
    const deployedContract = await deployment.send({ from: account.address, gas });

    console.log("Contract deployed at address:", deployedContract.options.address);
    return deployedContract.options.address;
  } catch (error) {
    console.error("Deployment error:", error);
  }
};

// Usage
// const privateKey = "0x96e2ee3510fb7814b8f07956122eb36790b1f9937625bef049e3920f9e52b1d7";
// deployContract(bytecode, abi, privateKey);
module.exports = {compileContract, deployContract}