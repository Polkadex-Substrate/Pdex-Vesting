var PolkaDex = artifacts.require("PolkaDex.sol");
var ERC20 = artifacts.require("ERC20.sol");

module.exports = async function(deployer) {
  await deployer.deploy(PolkaDex);
//  let address = await web3.eth.getAccounts();
  // await deployer.deploy(ERC20, address[0], PolkaDex.address);
};
