"use client";

import { useState, useEffect } from "react";
import { useWallet } from '../context/WalletContext';
import {
  fetchContractCode,
  fetchContractHistory,
  fetchMemecoinDetails,
  fetchTopHolders,
  fetchContractCreationBlock,
  fetchNumberOfHolders,
  calculateRiskScore,
} from "../services/ethereum";
import { ClipLoader } from "react-spinners";
import { FaCopy } from "react-icons/fa";
import RiskScoreDetails from './RiskScoreDetails'; // Importing the new component

const RiskChecker = () => {
  const [address, setAddress] = useState("");
  const [memecoinDetails, setMemecoinDetails] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [detailedScores, setDetailedScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [steps, setSteps] = useState([
    { step: "Validating Address", status: "pending" },
    { step: "Fetching Contract History", status: "pending" },
    { step: "Fetching Token Details", status: "pending" },
    { step: "Fetching Top Holders", status: "pending" },
    { step: "Calculating Risk Score", status: "pending" },
  ]);

  const { network } = useWallet();

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  const updateStepStatus = (index, status) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status } : s))
    );
  };

  const handleCheckRisk = async () => {
    setRiskScore(null);
    setMemecoinDetails(null);
    setStatus("");
    setIsLoading(true);
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
      alert("Invalid Ethereum address!");
      setIsLoading(false);
      return;
    }

    try {
      updateStepStatus(0, "in-progress");
      const code = await fetchContractCode(address);
      updateStepStatus(0, "completed");

      if (code === "0x") {
        alert("This address does not contain a contract.");
        setIsLoading(false);
        return;
      }

      updateStepStatus(1, "in-progress");
      const transactions = await fetchContractHistory(address);
      updateStepStatus(1, "completed");

      updateStepStatus(2, "in-progress");
      const details = await fetchMemecoinDetails(address);
      updateStepStatus(2, "completed");

      updateStepStatus(3, "in-progress");
      const topHolders = await fetchTopHolders(address);
      updateStepStatus(3, "completed");

      updateStepStatus(4, "in-progress");
      const { finalScore, detailedScores } = calculateRiskScore(
        transactions,
        details.price,
        topHolders,
        details.marketCap,
        details.volume
      );
      setRiskScore(finalScore);
      setDetailedScores(detailedScores);
      updateStepStatus(4, "completed");

      const memecoinData = {
        ...details,
        topHolders,
        creationBlock: await fetchContractCreationBlock(address),
        numberOfHolders: await fetchNumberOfHolders(address),
      };

      setMemecoinDetails(memecoinData);
      setIsLoading(false);
      setStatus("Done");

      const newSearch = {
        address,
        details: memecoinData,
        score: finalScore,
        status: finalScore >= 75 ? "High Risk 🔴" : finalScore >= 50 ? "Medium Risk 🟡" : "Low Risk 🟢",
      };

      setRecentSearches([newSearch, ...recentSearches.slice(0, 4)]);
    } catch (error) {
      console.error("Error during risk assessment:", error);
      setStatus("Error occurred during risk assessment.");
      setIsLoading(false);
    }
  };

  const handleCopyData = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert("Data copied to clipboard!");
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  return (
    <div className="flex">
      <div className="container flex-1">
        <h1 className="text-4xl mb-4">Meme Police 🚓</h1>
        {network && <p>Current Network: {network}</p>}
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Memecoin Contract Address"
          className="mb-4 w-full"
        />
        <button onClick={handleCheckRisk} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <ClipLoader color="#fff" size={20} />
              <span className="ml-2"> ✅ Checking...</span>
            </>
          ) : (
            "Guilty or Not"
          )}
        </button>
        <div>
          {steps.map((step, index) => (
            <div key={index} className={`step-card ${step.status}`}>
              <h3>{step.step}</h3>
              {step.status === "in-progress" && <ClipLoader size={20} />}
              {step.status === "completed" && <span>✅</span>}
            </div>
          ))}
        </div>
        {status && <p className="mt-4">{status}</p>}
        {riskScore !== null && memecoinDetails && (
          <div className="card mt-4">
            <h2 className="text-xl">{memecoinDetails.name} ({memecoinDetails.symbol})</h2>
            <p>Price: ${memecoinDetails.price?.toFixed(4)}</p>
            <p>Market Cap: ${memecoinDetails.marketCap?.toLocaleString()}</p>
            <p>Volume: ${memecoinDetails.volume?.toLocaleString()}</p>
            <p>Number of Holders: {memecoinDetails.numberOfHolders || 'N/A'}</p>
            <p>Contract Creation Block: {memecoinDetails.creationBlock}</p>
            <p className={`text-lg ${riskScore >= 75 ? 'text-red-500' : riskScore >= 50 ? 'text-yellow-500' : 'text-green-500'}`}>
              Risk Score: {riskScore} - {riskScore >= 75 ? "High Risk" : riskScore >= 50 ? "Medium Risk" : "Low Risk"}
            </p>

            <RiskScoreDetails detailedScores={detailedScores} />

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

      {/* Recent Searches */}
      <div className="right-content w-1/3 ml-5 overflow-y-auto" style={{ maxHeight: '80vh' }}>
        <h2 className="text-2xl font-semibold mb-4">Recent Searches</h2>
        <button 
          onClick={handleClearHistory}
          className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Clear History
        </button>
        <div className="space-y-4">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className={`card p-4 rounded shadow-lg hover:bg-gray-700 cursor-pointer transition-all duration-200 ease-in-out ${expandedIndex === index ? 'expanded' : ''}`}
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
                <p className="text-sm">Market Cap: ${search.details.marketCap?.toLocaleString()}</p>
                <p className="text-sm">Volume: ${search.details.volume?.toLocaleString()}</p>
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
                  className="mt-4 bg-gray-100 text-white px-4 py-2 rounded hover:bg-gray-500 transition flex items-center"
                >
                  <FaCopy className="mr-2" /> Copy Data
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default RiskChecker;
