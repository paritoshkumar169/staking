import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const TOKEN_ABI = [
  {
    "inputs": [{"internalType": "uint256","name": "initialSupply","type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "address","name": "account","type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
];

const TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890'; 

const STAKING_ABI = [
  {
    "inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ... other functions ...
];

const STAKING_ADDRESS = '0x0987654321098765432109876543210987654321'; // Example address

function App() {
  const [account, setAccount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        updateBalances(address);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      console.log('Please install MetaMask');
    }
  }

  async function updateBalances(address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
    const stakingContract = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, provider);

    const balance = await tokenContract.balanceOf(address);
    setTokenBalance(ethers.utils.formatEther(balance));

    const staked = await stakingContract.stakedBalance(address);
    setStakedBalance(ethers.utils.formatEther(staked));
  }

  async function handleStake() {
    if (!stakeAmount) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
    const stakingContract = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, signer);

    try {
      const amount = ethers.utils.parseEther(stakeAmount);
      await tokenContract.approve(STAKING_ADDRESS, amount);
      await stakingContract.stake(amount);
      updateBalances(account);
      setStakeAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
    }
  }

  return (
    <div className="App">
      <h1>Custom Token Staking</h1>
      {account ? (
        <>
          <p>Connected Account: {account}</p>
          <p>Token Balance: {tokenBalance}</p>
          <p>Staked Balance: {stakedBalance}</p>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Amount to stake"
          />
          <button onClick={handleStake}>Stake</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Custom Token Staking</h1>
      {account ? (
        <>
          <p>Connected Account: {account}</p>
          <p>Token Balance: {tokenBalance}</p>
          <p>Staked Balance: {stakedBalance}</p>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Amount to stake"
          />
          <button onClick={handleStake}>Stake</button>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
