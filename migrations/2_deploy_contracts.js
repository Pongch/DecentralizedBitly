var PersistentBit = artifacts.require("./PersistentBit.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(PersistentBit);
  deployer.deploy(SimpleStorage);
};
