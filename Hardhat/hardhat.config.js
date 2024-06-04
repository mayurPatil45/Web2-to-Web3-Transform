/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle")

const ALCHEMY_APT_KEY = "D55MV0ryz44LQyyCxjgk1uq_h3PLcQ_b"
const goerli_private_key= "86a9a21e6b49f0ce7ec54f6ba1377c0904f1f9d85a68c8315675e62c08c8f0bf"

module.exports = {
  solidity: "0.8.18",

  networks:{
    goerli:{
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_APT_KEY}`,
      accounts:[`${goerli_private_key}`],
    }
  }
};
