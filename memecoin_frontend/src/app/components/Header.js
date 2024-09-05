"use client";

import React from 'react';
import { useWallet } from '../context/WalletContext';

const Header = () => {
  const { currentAccount, isConnected, connectWallet, disconnectWallet, network } = useWallet();

  return (
    <header className="header flex justify-between items-center p-4 bg-gray-900 text-white">
      <div className="text-xl font-bold">MemePolice</div>
      <nav>
        <a href="/" className="mr-4">Home</a>
        <a href="/meme-police" className="mr-4">Meme Police</a>
      </nav>
      <div className="flex items-center">
        {isConnected ? (
          <>
            <span className="mr-4">
              Connected: {currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : "Unknown"}
            </span>
            <span className="mr-4">Network: {network}</span>
            <button onClick={disconnectWallet} className="bg-red-600 px-4 py-2 rounded">
              Disconnect
            </button>
          </>
        ) : (
          <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded">
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
