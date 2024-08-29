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
import { FaCopy } from "react-icons/fa";

const RiskChecker = () => {
  const [address, setAddress] = useState("");
  const [memecoinDetails, setMemecoinDetails] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleCheckRisk = async () => {
    setRiskScore(null);
    setMemecoinDetails(null);
    setStatus("");
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
      details: memecoinData,
      score,
      status: score >= 75 ? "High Risk 🔴" : score >= 50 ? "Medium Risk 🟡" : "Low Risk 🟢",
    };
    setRecentSearches([newSearch, ...recentSearches.slice(0, 4)]);
  };

  const handleCopyData = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("Data copied to clipboard!");
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container">
      <h1 className="text-4xl mb-4">Meme Police 🚓</h1>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Memecoin Contract Address"
        className="mb-4 w-full"
      />
      <button
        onClick={handleCheckRisk}
        className="w-full"
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
        <p className="mt-4">{status}</p>
      )}
      {riskScore !== null && memecoinDetails && (
        <div className="card mt-4">
          <h2 className="text-xl">{memecoinDetails.name} ({memecoinDetails.symbol})</h2>
          <p>Price: ${memecoinDetails.price?.toFixed(4)}</p>
          <p className={`text-lg ${riskScore >= 75 ? 'text-red-500' : riskScore >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>
            Risk Score: {riskScore} - {riskScore >= 75 ? "High Risk" : riskScore >= 50 ? "Medium Risk" : "Low Risk"}
          </p>
          <h3 className="text-lg mt-4">Top Holders:</h3>
          <ul>
            {memecoinDetails.topHolders && memecoinDetails.topHolders.length > 0 ? (
              memecoinDetails.topHolders.map((holder, index) => (
                <li key={index}>
                  {holder.address} - {holder.percentage}%
                </li>
              ))
            ) : (
              <li>No top holders available</li>
            )}
          </ul>
          <button
            onClick={() => handleCopyData(memecoinDetails)}
            className="mt-4 flex items-center"
          >
            <FaCopy className="mr-2" /> Copy Data
          </button>
        </div>
      )}
    </div>
  );
};

export default RiskChecker;
