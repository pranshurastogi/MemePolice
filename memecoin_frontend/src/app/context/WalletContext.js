"use client";

import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState("Unknown");

  // Handle connecting to the wallet
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
          throw new Error("No accounts found.");
        }
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
        const netVersion = await window.ethereum.request({ method: 'net_version' });
        setNetwork(getNetworkName(netVersion));
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Failed to connect wallet: " + error.message);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Automatically connect and set up listeners when the component mounts
  useEffect(() => {
    connectWallet().catch(console.error);

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
      } else {
        disconnectWallet();
      }
    };

    const handleChainChanged = (chainId) => {
      setNetwork(getNetworkName(chainId));
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Handle disconnecting the wallet
  const disconnectWallet = () => {
    setCurrentAccount(null);
    setIsConnected(false);
    setNetwork("Unknown");
  };

  // Utility to get the network name from its ID
  const getNetworkName = (netVersion) => {
    const networkNames = {
      "1": "Ethereum Mainnet",
      "3": "Ropsten Testnet",
      "4": "Rinkeby Testnet",
      "5": "Goerli Testnet",
      "42": "Kovan Testnet",
      "11155111": "Sepolia Testnet",
      "137": "Polygon Mainnet",
      "80001": "Mumbai Testnet",
      "10": "Optimism Mainnet",
      "69": "Optimism Kovan",
      "420": "Optimism Goerli",
      "42161": "Arbitrum One Mainnet",
      "421611": "Arbitrum Rinkeby Testnet",
      "421613": "Arbitrum Goerli Testnet",
      "56": "Binance Smart Chain Mainnet",
      "97": "Binance Smart Chain Testnet",
      "100": "Gnosis Chain",
      "43114": "Avalanche C-Chain Mainnet",
      "43113": "Avalanche Fuji Testnet",
      "250": "Fantom Opera Mainnet",
      "4002": "Fantom Testnet",
      default: "Unknown"
    };
    return networkNames[netVersion] || "Unknown";
  };

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
