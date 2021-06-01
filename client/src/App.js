import React, { Component } from "react";
import PolkaDex from "./contracts/PolkaDex.json"
import getWeb3 from "./getWeb3";
import PolkaAbi from "./Abi.json";

import "./App.css";

class App extends Component {
  state = {loading: false, contractAddress:null,userTokens:0,vestedTokens:0,totalSupply:0,owner:0 };

  componentDidMount = async () => {
    try {
      //Contract address
      const PolkaAddress = "0xF59ae934f6fe444afC309586cC60a84a0F89Aaea"
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.PolkaDexInstance = new this.web3.eth.Contract(
        PolkaAbi,
        PolkaAddress
      );
      console.log(this.PolkaDexInstance, "------------");

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer()
      this.setState({loading: true, contractAddress: PolkaAddress}, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

buttonClick = async () => {
let VestedTokens = await this.PolkaDexInstance.methods.VestedTokens(this.accounts[0]).call({ from: this.accounts[0]})
let balance = await this.PolkaDexInstance.methods.balanceOf(this.accounts[0]).call()
let claimVestedTokens
if(VestedTokens > 0) {
  claimVestedTokens = await this.PolkaDexInstance.methods.ClaimAfterVesting().send({ from: this.accounts[0]}, function(err,data){
    console.log(err,"err");
    console.log(data,"data")
  });  
}
else {
  alert('User has 0 Vested balance')
}




console.log(this.accounts[0], "Current account address")
console.log(claimVestedTokens, "claimVestedTokens");
    console.log(balance, "balance");
    
    // console.log(owner, "owner");

console.log(VestedTokens,"vested balance");
  // console.log(totalSupply, "totalSupply");



}

updateUserTokens = async () => {
  let userTokens = await this.PolkaDexInstance.methods.balanceOf(this.accounts[0]).call();
  let vestedTokens = await this.PolkaDexInstance.methods.VestedTokens(this.accounts[0]).call({ from: "0x70cE694Ea3096763295Eb38977c41890808A34Fa"})
  let totalSupply = await this.PolkaDexInstance.methods.totalSupply().call({from: "0xF59ae934f6fe444afC309586cC60a84a0F89Aaea"});
  let owner = await this.PolkaDexInstance.methods.ShowOwner().call({from: "0xF59ae934f6fe444afC309586cC60a84a0F89Aaea"});



  this.setState({userTokens:userTokens/10**18, vestedTokens:vestedTokens/10**18, totalSupply:totalSupply/10**18,owner:owner});
}

listenToTokenTransfer = () => {
  this.PolkaDexInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens)
}

  render() {
    if (!this.state.loading) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <button type="button" onClick={this.buttonClick}>Click me</button>
        <p>Your contract address is <b>{this.state.contractAddress}</b></p>
        <p>The owner of the contract is <b>{this.state.owner}</b></p>
        <p>Your total supply is <b>{this.state.totalSupply}</b></p>
        <p>You currently have <b>{(this.state.vestedTokens)}</b> vested balance</p>
        <p>You currently have <b>{(this.state.userTokens)}</b> balance</p>
      </div>
    );
  }
}

export default App;
