import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'
import Whitelist from './artifacts/contracts/Merkle.sol/Whitelist.json'
const { tree } = require('./merkle/merkle')
const keccak256 = require('keccak256')

function App() {
  const [feedback, setFeedback] = useState("Connect to Metamask to check Whitelist Status");
  
  async function requestAccount() {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log(window.ethereum);
  }
 
  async function checkWhitelist() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const whitelistContractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      const signer = provider.getSigner()
      const contract = new ethers.Contract(whitelistContractAdress, Whitelist.abi, signer)
      const accounts = await provider.listAccounts();
      const buf2hex = x => '0x'+x.toString('hex')
      const leaf = keccak256(accounts[0])
      const hexProof = tree.getProof(leaf).map(x => buf2hex(x.data))
      const positions = tree.getProof(leaf).map(x => x.position === 'right' ? 1 : 0)
      //return await contract.functions.verifyWhitelist(hexProof, positions)
      if (await contract.functions.verifyWhitelist(hexProof, positions)) {
        setFeedback("You're on the Whitelist! Proceed.")
      } else {
        setFeedback("Not included on the Whitelist, Sorry bud.")
      }
  }

  const isMetaMaskConnected = async () => {
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  }

  return (
    <div className="App">
      <header className="App-header">
        {!isMetaMaskConnected ? (
        <button onClick={requestAccount}>Connect to MetaMask</button> 
        ) : (
          <button onClick={checkWhitelist}>Check Whitelist</button>
        )}
      <div>
        {feedback}
      </div>
      </header>
    </div>
  );
}

export default App;
