"use client"; // Mark as a client component

import { useState } from "react";
import { fetchContractCode, fetchContractHistory, calculateRiskScore } from "../services/ethereum";

const RiskChecker = () => {
  const [address, setAddress] = useState("");
  const [riskScore, setRiskScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleCheckRisk = async () => {
    setRiskScore(null); // Reset previous score
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
    console.log(transactions);
    setStatus("Calculating risk score...");
    const score = calculateRiskScore(transactions);
    setRiskScore(score);
    setIsLoading(false);
    setStatus("Done");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center animate__animated animate__fadeInDown">
        <h1 className="text-4xl font-bold mb-6">Meme Police</h1>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Memecoin Contract Address"
          className="p-3 border border-gray-700 rounded w-full mb-4 text-black"
        />
        <button
          onClick={handleCheckRisk}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Checking..." : "Guilty or Not"}
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
      <img
        src="/police-background.png" // Make sure you have this image in the public folder
        alt="Police Theme"
        className="absolute inset-0 z-0 opacity-10 w-full h-full object-cover"
      />
    </div>
  );
};

export default RiskChecker;
