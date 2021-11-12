import './App.css';
import React from "react";
import { useState } from 'react';
import { ethers } from 'ethers'
import Whitelist from './artifacts/contracts/Merkle.sol/Whitelist.json'
import { NoWalletDetected } from "./components/NoWalletDetected";
import { ConnectWallet } from "./components/ConnectWallet";
import { Loading } from "./components/Loading"
const { tree } = require('./merkle/merkle')
const keccak256 = require('keccak256')

const HARDHAT_NETWORK_ID = '31337';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      account: "",
      isWhitelisted: false
    };
    this.state = this.initialState;
  }
  
  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If everything is loaded, we render the application.
    return (
      <div></div>
    );
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.enable();

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      this._resetState();
    });
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      0x5FbDB2315678afecb367f032d93F642f64180aa3,
      Whitelist.abi,
      this._provider.getSigner(0)
    );
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Localhost:8545 
  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Localhost:8545'
    });

    return false;
  }
}
  

//const provider = new ethers.providers.Web3Provider(window.ethereum);
const whitelistContractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

async function checkWhitelist() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const contract = new ethers.Contract(whitelistContractAdress, Whitelist.abi, signer)
  const accounts = await provider.listAccounts();
  const buf2hex = x => '0x'+x.toString('hex')
  const leaf = keccak256(accounts[0])
  const hexProof = tree.getProof(leaf).map(x => buf2hex(x.data))
  const positions = tree.getProof(leaf).map(x => x.position === 'right' ? 1 : 0)
  console.log(await contract.functions.verifyWhitelist(hexProof, positions))
  // if (contract.verifyWhitelist(hexProof, positions)) { // why does this return an array? this is messed up
  //   setFeedback("You're on the Whitelist! Proceed.")
  // } else {
  //   setFeedback("Not included on the Whitelist, Sorry bud.")
  // }
  }
// export default App;