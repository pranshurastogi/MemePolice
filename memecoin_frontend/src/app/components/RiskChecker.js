"use client"; // Mark as a client component

import { useState } from "react";
import {
  fetchContractCode,
  fetchContractHistory,
  fetchMemecoinDetails,
  fetchTopHolders,
  calculateRiskScore,
} from "../services/ethereum";
import { ClipLoader } from "react-spinners";
import { FaCopy } from "react-icons/fa"; // Import a copy icon

const RiskChecker = () => {
  const [address, setAddress] = useState("");
  const [memecoinDetails, setMemecoinDetails] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleCheckRisk = async () => {
    setRiskScore(null); // Reset previous score
    setMemecoinDetails(null);
    setStatus(""); // Reset status
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
      alert("Invalid Ethereum address!");
      return;
    }

    setIsLoading(true);
    setStatus("Validating address...");

    const code = await fetchContractCode(address);
    if (code === "0x") {
      alert("This address does not contain a contract.");
      setIsLoading(false);
      setStatus("");
      return;
    }

    setStatus("Fetching contract history...");
    const transactions = await fetchContractHistory(address);

    setStatus("Fetching memecoin details...");
    const details = await fetchMemecoinDetails(address);
    const topHolders = await fetchTopHolders(address);

    setStatus("Calculating risk score...");
    const score = calculateRiskScore(transactions, details.price, topHolders);

    const memecoinData = {
      ...details,
      topHolders,
    };

    setMemecoinDetails(memecoinData);
    setRiskScore(score);
    setIsLoading(false);
    setStatus("Done");

    // Add to recent searches
    const newSearch = {
      address,
      details: memecoinData, // Ensure all details are included
      score,
      status: score >= 75 ? "High Risk 🔴" : score >= 50 ? "Medium Risk 🟡" : "Low Risk 🟢",
    };
    setRecentSearches([newSearch, ...recentSearches.slice(0, 4)]); // Keep only the last 5 searches
  };

  const handleCopyData = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("Data copied to clipboard!");
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="flex items-start min-h-screen bg-gray-900 text-white p-5">
      <div className="flex-2 max-w-md w-full">
        <div className="relative z-10 bg-blue-800 p-8 rounded-lg shadow-lg w-full text-center animate__animated animate__fadeInDown">
          <h1 className="text-4xl font-bold mb-6">Meme Police 🚓</h1>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Memecoin Contract Address"
            className="p-3 border border-gray-700 rounded w-full mb-4 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleCheckRisk}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ClipLoader color="#fff" size={20} />
                <span className="ml-2"> ✅Checking...</span>
              </>
            ) : (
              "Guilty or Not"
            )}
          </button>
          {status && (
            <p className="mt-4 text-sm text-gray-400">{status}</p>
          )}
          {riskScore !== null && memecoinDetails && (
            <div className="mt-8 p-6 bg-gray-700 rounded shadow-lg">
              <h2 className="text-2xl font-semibold">
                {memecoinDetails.name} ({memecoinDetails.symbol})
              </h2>
              {memecoinDetails.price !== null && !isNaN(memecoinDetails.price) ? (
                <p className="mt-2 text-lg">Price: ${memecoinDetails.price.toFixed(4)}</p>
              ) : (
                <p className="mt-2 text-lg text-red-500">Price data unavailable</p>
              )}
              <p className={`mt-2 text-lg ${riskScore >= 75 ? 'text-red-500' : riskScore >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                Risk Score: {riskScore} - {riskScore >= 75 ? "High Risk" : riskScore >= 50 ? "Medium Risk" : "Low Risk"}
              </p>
              <h3 className="mt-4 text-lg">Top Holders:</h3>
              <ul className="mt-2 text-left">
                {memecoinDetails.topHolders && memecoinDetails.topHolders.length > 0 ? (
                  memecoinDetails.topHolders.map((holder, index) => (
                    <li key={index}>
                      {holder.address} - {holder.percentage}%
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-400">No top holders available</li>
                )}
              </ul>
              <button
                onClick={() => handleCopyData(memecoinDetails)}
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition flex items-center"
              >
                <FaCopy className="mr-2" /> Copy Data
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 ml-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Searches</h2>
        <div className="space-y-4">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className={`bg-gray-800 p-4 rounded shadow-lg hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in-out ${expandedIndex === index ? 'expanded' : ''}`}
              onClick={() => toggleExpand(index)}
            >
              <div className="flex justify-between w-full">
                <div>
                  <a
                    href={`https://etherscan.io/address/${search.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {search.details.name} ({search.details.symbol})
                  </a>
                  <p className="text-sm text-green-400">Price: ${search.details.price?.toFixed(4) || "N/A"}</p>
                </div>
                <span className={`text-lg ${search.score >= 75 ? 'text-red-500' : search.score >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {search.status}
                </span>
              </div>
              {expandedIndex === index && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400">Risk Score: {search.score}</p>
                  <h3 className="mt-2 text-sm text-gray-400">Top Holders:</h3>
                  <ul className="mt-2">
                    {search.details.topHolders && search.details.topHolders.length > 0 ? (
                      search.details.topHolders.map((holder, i) => (
                        <li key={i} className="text-sm text-green-6000">
                          {holder.address} - {holder.percentage}%
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-400">No top holders available</li>
                    )}
                  </ul>
                  <button
                    onClick={() => handleCopyData(search.details)}
                    className="mt-4 bg-gray-1000 text-white px-4 py-2 rounded hover:bg-gray-500 transition flex items-center"
                  >
                    <FaCopy className="mr-2" /> Copy Data
                  </button>
                </div>
              )}
            </div>
          ))}
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
