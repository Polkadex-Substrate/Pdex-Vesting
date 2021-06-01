const path = require("path");
require("dotenv").config({path: "./.env"});
const HDWalletProvider = require('@truffle/hdwallet-provider');
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ganache_local: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", AccountIndex)
      },
      network_id: 5777
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/a59abf3cfde147728b1f64b13aa7410e", AccountIndex)
      },
      network_id: 5,
      networkCheckTimeout: 10000000
    },
    ropsten_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/a59abf3cfde147728b1f64b13aa7410e", AccountIndex)
      },
      network_id: 3,
      networkCheckTimeout: 10000000,
      skipDryRun: true  

    },
    mainNet_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://mainnet.infura.io/v3/a59abf3cfde147728b1f64b13aa7410e", AccountIndex)
      },
      gas: 6721975,
      gasPrice: 10000000000,
      network_id: 1
    }    

  },
  compilers: {
    solc: {
      version: "0.7.6"
    }
  }
};
