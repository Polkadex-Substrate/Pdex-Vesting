import React, { Component } from "react";
import PolkaDex from "./contracts/PolkaDex.json";
import getWeb3 from "./getWeb3";
import PolkaAbi from "./Abi.json";
// import Logo from "";

import "./App.css";

class App extends Component {
  state = { loading: false, contractAddress: null, userTokens: 0, vestedTokens: 0, totalSupply: 0, owner: 0, image: '../Logo.png' };

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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer()
      this.setState({ loading: true, contractAddress: PolkaAddress }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  buttonClick = async () => {
    let VestedTokens = await this.PolkaDexInstance.methods.VestedTokens(this.accounts[0]).call({ from: this.accounts[0] })
    let claimVestedTokens
      claimVestedTokens = await this.PolkaDexInstance.methods.ClaimAfterVesting().send({ from: this.accounts[0] }, function (err, data) {
        console.log(err, "err");
        console.log(data, "data")
      });
    
    console.log(claimVestedTokens, "claimVestedTokens");

  }

  updateUserTokens = async () => {
    let owner = await this.PolkaDexInstance.methods.ShowOwner().call();
    let totalSupply = await this.PolkaDexInstance.methods.totalSupply().call();
    let userTokens = await this.PolkaDexInstance.methods.balanceOf(this.accounts[0]).call();
    let vestedTokens = await this.PolkaDexInstance.methods.VestedTokens(this.accounts[0]).call()



    this.setState({ userTokens: userTokens / 10 ** 18, vestedTokens: vestedTokens / 10 ** 18, totalSupply: totalSupply / 10 ** 18, owner: owner });
  }

  listenToTokenTransfer = () => {
    this.PolkaDexInstance.events.Transfer({ to: this.accounts[0] }).on("data", this.updateUserTokens)
  }

  render() {
    if (!this.state.loading) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <div className="navBar">
          <img className="logo" src={this.state.image}/>
        </div>
      <div className="cardContainer">
      <div className="card">
        <p>Contract Address: <b>{this.state.contractAddress}</b></p>
        <p>Total Supply: <b>{this.state.totalSupply}</b></p>
        <p>Vested Balance: <b>{(this.state.vestedTokens)}</b></p>
        <p>Current Balance: <b>{(this.state.userTokens)}</b></p>
        <button type="button" onClick={this.buttonClick} className="vestedButton">Claim Vested Tokens</button>
      </div>
      </div>
      </div>
    );
  }
}

export default App;
