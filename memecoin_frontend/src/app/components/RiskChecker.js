"use client"; // Mark as a client component

import { useState } from "react";
import { fetchContractCode, fetchContractHistory, calculateRiskScore } from "../services/ethereum";

const RiskChecker = () => {
  const [address, setAddress] = useState("");
  const [riskScore, setRiskScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckRisk = async () => {
    setRiskScore(null); // Reset previous score
    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
      alert("Invalid Ethereum address!");
      return;
    }

    setIsLoading(true);

    const code = await fetchContractCode(address);
    if (code === "0x") {
      alert("This address does not contain a contract.");
      setIsLoading(false);
      return;
    }

    const transactions = await fetchContractHistory(address);
    console.log(transactions)
    const score = calculateRiskScore(transactions);
    setRiskScore(score);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
      <h1 className="text-4xl font-bold mb-6">Meme Police</h1>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Memecoin Contract Address"
        className="p-2 border border-gray-300 rounded w-96 mb-4"
      />
      <button
        onClick={handleCheckRisk}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        disabled={isLoading}
      >
        {isLoading ? "Checking..." : "Guilty or Not"}
      </button>
      {riskScore !== null && (
        <div className="mt-8 p-4 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold">Risk Score: {riskScore}</h2>
          <p className="mt-2 text-lg">
            {riskScore > 50 ? "Guilty (High Risk)" : "Not Guilty (Low Risk)"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskChecker;
