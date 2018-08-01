
var HDWalletProvider = require("truffle-hdwallet-provider");
var infura_apikey = "TrBuamh4xcgE2mLnXRdz ";
var mnemonic = "kiwi snack position glimpse work tortoise logic siren uphold type minute feel";
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    mainnet: {
      provider: new HDWalletProvider(mnemonic, "https://mainnet.infura.io/"+infura_apikey, 1),
      network_id: 1,
      gas: 2000000
    }
  }
};