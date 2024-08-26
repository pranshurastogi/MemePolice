"use client"; // Mark as a client component

import { useState, useEffect } from "react";
import { fetchContractCode, fetchContractHistory, calculateRiskScore, fetchMemecoinPrice, fetchTopHolders } from "../services/ethereum";

const RiskChecker = () => {
  const [address, setAddress] = useState("");
  const [riskScore, setRiskScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [topHolders, setTopHolders] = useState([]);
  const [price, setPrice] = useState(null);

  const handleCheckRisk = async () => {
    setRiskScore(null); // Reset previous score
    setStatus(""); // Reset status
    setTopHolders([]);
    setPrice(null);

    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
      alert("Invalid Ethereum address!");
      return;
    }

    setIsLoading(true);
    setStatus("👮‍♂️ Validating address...");

    const code = await fetchContractCode(address);
    if (code === "0x") {
      alert("This address does not contain a contract.");
      setIsLoading(false);
      setStatus("");
      return;
    }

    setStatus("👮‍♂️ Fetching contract history...");
    const transactions = await fetchContractHistory(address);

    setStatus("👮‍♂️ Fetching memecoin price...");
    const memecoinPrice = await fetchMemecoinPrice(address);
    setPrice(memecoinPrice);

    setStatus("👮‍♂️ Fetching top holders...");
    const holders = await fetchTopHolders(address);
    setTopHolders(holders);

    setStatus("Calculating risk score...");
    const score = calculateRiskScore(transactions, memecoinPrice, holders);
    setRiskScore(score);
    setIsLoading(false);
    setStatus("Done");

    // Add to recent searches
    const newSearch = {
      address,
      score,
      status: score > 50 ? "Guilty 😈" : "Not Guilty 😇",
      price: memecoinPrice,
      topHolders: holders,
    };
    setRecentSearches([newSearch, ...recentSearches.slice(0, 4)]); // Keep only the last 5 searches
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex w-full max-w-5xl space-x-8">
        <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center animate__animated animate__fadeInDown">
          <h1 className="text-4xl font-bold mb-6">Meme Police</h1>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Memecoin Contract Address"
            className="p-3 border border-gray-700 rounded w-full mb-4 text-white"
          />
          <button
            onClick={handleCheckRisk}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? "👮‍♂️ Checking..." : "Guilty 😈 or Not 😇"}
          </button>
          {status && (
            <p className="mt-4 text-sm text-gray-400">{status}</p>
          )}
          {riskScore !== null && (
            <div className="mt-8 p-4 bg-gray-700 rounded shadow">
              <h2 className="text-2xl font-semibold">Risk Score: {riskScore}</h2>
              <p className="mt-2 text-lg">
                {riskScore > 50 ? "Guilty (High Risk)" : "Not Guilty (Low Risk)"}
              </p>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Recent Searches</h2>
          <div className="space-y-4">
            {recentSearches.map((search, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded shadow-lg flex items-center justify-between">
                <div>
                  <a
                    href={`https://etherscan.io/address/${search.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {search.address}
                  </a>
                  <p className="text-sm text-gray-400">Risk Score: {search.score}</p>
                  <p className={`text-sm ${search.price < 0.001 ? 'text-red-500' : 'text-green-500'}`}>
                    Price: ${search.price}
                  </p>
                  <p className="text-sm text-gray-400">Top Holders:</p>
                  {search.topHolders.map((holder, i) => (
                    <p key={i} className="text-sm text-gray-400">
                      {holder.address} - {holder.percentage}%
                    </p>
                  ))}
                </div>
                <span className="text-lg">{search.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <img
        src="/police-background.png"
        alt="Police Theme"
        className="absolute inset-0 z-0 opacity-10 w-full h-full object-cover"
      />
    </div>
  );
};

export default RiskChecker;
