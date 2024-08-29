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
      case "137":
        return "Polygon Mainnet";
      case "80001":
        return "Mumbai Testnet";
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
