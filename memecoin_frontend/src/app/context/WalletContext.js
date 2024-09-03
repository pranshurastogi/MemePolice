"use client";

import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState("Unknown");

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setIsConnected(true);
        }
        // Fetch the network version using net_version RPC method
        const netVersion = await window.ethereum.request({ method: 'net_version' });
        setNetwork(getNetworkName(netVersion));
      } catch (error) {
        console.error("Failed to connect wallet", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
            setIsConnected(true);
          }
        })
        .catch(error => {
          console.error("Failed to get accounts", error);
        });

      // Fetch the network version using net_version RPC method
      window.ethereum.request({ method: 'net_version' })
        .then(netVersion => {
          setNetwork(getNetworkName(netVersion));
        })
        .catch(error => {
          console.error("Failed to get network version", error);
        });
    }
  }, []);

  const disconnectWallet = () => {
    setCurrentAccount(null);
    setIsConnected(false);
    setNetwork("Unknown");
  };

  const getNetworkName = (netVersion) => {
    switch (netVersion) {
      case "1":
        return "Ethereum Mainnet";
      case "3":
        return "Ropsten Testnet";
      case "4":
        return "Rinkeby Testnet";
      case "5":
        return "Goerli Testnet";
      case "42":
        return "Kovan Testnet";
      case "11155111":
        return "Sepolia Testnet";
      case "137":
        return "Polygon Mainnet";
      case "80001":
        return "Mumbai Testnet";
      case "10":
        return "Optimism Mainnet";
      case "69":
        return "Optimism Kovan";
      case "420":
        return "Optimism Goerli";
      case "42161":
        return "Arbitrum One Mainnet";
      case "421611":
        return "Arbitrum Rinkeby Testnet";
      case "421613":
        return "Arbitrum Goerli Testnet";
      case "56":
        return "Binance Smart Chain Mainnet";
      case "97":
        return "Binance Smart Chain Testnet";
      case "100":
        return "Gnosis Chain (formerly xDai)";
      case "43114":
        return "Avalanche C-Chain Mainnet";
      case "43113":
        return "Avalanche Fuji Testnet";
      case "250":
        return "Fantom Opera Mainnet";
      case "4002":
        return "Fantom Testnet";
      default:
        return "Unknown";
    }
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
