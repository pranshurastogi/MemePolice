"use client";

import React from 'react';
import { useWallet } from '../context/WalletContext';

const Header = () => {
  const { currentAccount, isConnected, connectWallet } = useWallet();

  return (
    <header className="flex justify-between items-center p-5 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">MemePolice</h1>
      <nav className="space-x-4">
        <a href="/" className="hover:text-blue-400">Home</a>
        <a href="/meme-police" className="hover:text-blue-400">Meme Police</a>
        <button 
          onClick={connectWallet}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          {isConnected ? `Connected: ${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : "Connect Wallet"}
        </button>
      </nav>
    </header>
  );
};

export default Header;
