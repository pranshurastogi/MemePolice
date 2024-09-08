"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';

// Get environment variables from .env.local
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SIGN_PROTOCOL_RPC_URL || process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// Initialize web3-onboard
const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0xaa36a7', // Sepolia chain ID
      token: 'ETH',
      label: 'Sepolia Testnet',
      rpcUrl: sepoliaRpcUrl,
    },
    {
      id: '0x1', // Mainnet chain ID
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`, // Alchemy mainnet
    },
    {
      id: '0x89', // Polygon Mainnet
      token: 'MATIC',
      label: 'Polygon Mainnet',
      rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    },
    {
      id: '0xa', // Optimism Mainnet
      token: 'ETH',
      label: 'Optimism Mainnet',
      rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    }
  ],
  appMetadata: {
    name: 'Memecoin Police',
    description: 'Memecoin Police Web3 App',
    icon: '<svg></svg>', // Your app icon (optional)
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
    ],
  },
});

export default onboard;

const WalletContext = createContext();
export { onboard }; 

export const WalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState('Unknown');
  const [wallet, setWallet] = useState(null); // Store connected wallet info

  // Function to request a signature with a custom message
  const requestSignature = async (signer) => {
    const message = "Welcome to Memecoin Police, your investment our expertise!";
    try {
      const signature = await signer.signMessage(message);
      console.log("Signature obtained:", signature);
    } catch (error) {
      console.error("Error obtaining signature:", error);
      alert("Signature request failed: " + error.message);
    }
  };

  // Function to check for network and switch if needed
  const checkAndSwitchNetwork = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const { chainId } = await signer.provider.getNetwork();

    if (chainId !== 0xaa36a7) { // If not Sepolia Testnet
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }] // Switch to Sepolia Testnet
        });
        setNetwork('Sepolia Testnet');
      } catch (switchError) {
        if (switchError.code === 4902) {
          alert("Sepolia network not available in MetaMask. Please add it manually.");
        } else {
          console.error("Failed to switch network:", switchError);
        }
      }
    }
  };

  // Function to connect the wallet
  const connectWallet = async () => {
    try {
      const walletsConnected = await onboard.connectWallet(); // Initiate wallet connection

      if (walletsConnected.length === 0) {
        throw new Error("No wallets connected");
      }

      const connectedWallet = walletsConnected[0]; // First connected wallet
      const account = connectedWallet.accounts[0]; // First account

      setCurrentAccount(account.address);
      setIsConnected(true);
      setWallet(connectedWallet); // Store wallet info

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Request signature after connecting wallet
      await requestSignature(signer);

      const chain = onboard.state.get().chains[0];
      setNetwork(chain ? chain.label : 'Unknown');

      // Check and switch to Sepolia network if needed
      await checkAndSwitchNetwork();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet: " + error.message);
    }
  };

  const disconnectWallet = async () => {
    const walletsConnected = onboard.state.get().wallets;

    if (walletsConnected.length > 0) {
      const walletToDisconnect = walletsConnected[0];
      await onboard.disconnectWallet({ label: walletToDisconnect.label });
      setCurrentAccount(null);
      setIsConnected(false);
      setNetwork('Unknown');
      setWallet(null);
    }
  };

  useEffect(() => {
    const previouslyConnectedWallets = onboard.state.get().wallets;

    if (previouslyConnectedWallets.length > 0) {
      setCurrentAccount(previouslyConnectedWallets[0].accounts[0].address);
      setIsConnected(true);
    }

    // Subscribe to wallet/account changes
    const walletSub = onboard.state.select('wallets');
    const chainSub = onboard.state.select('chains');

    const handleWalletsUpdate = (wallets) => {
      if (wallets.length > 0) {
        const newWallet = wallets[0];
        setCurrentAccount(newWallet.accounts[0].address);
        setWallet(newWallet);
        setIsConnected(true);
      } else {
        disconnectWallet();
      }
    };

    const handleChainUpdate = (chains) => {
      const chain = chains[0];
      setNetwork(chain ? chain.label : 'Unknown');
    };

    const walletSubscription = walletSub.subscribe(handleWalletsUpdate);
    const chainSubscription = chainSub.subscribe(handleChainUpdate);

    return () => {
      walletSubscription.unsubscribe();
      chainSubscription.unsubscribe();
    };
  }, []);

  return (
    <WalletContext.Provider value={{ currentAccount, isConnected, network, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
