"use client"; // Add this line at the top

import { useState } from 'react';
import { ethers } from 'ethers';
import { SignProtocolClient, SpMode, EvmChains } from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';

export default function AttestationForm() {
  const [contractAddress, setContractAddress] = useState('');
  const [reputationScore, setReputationScore] = useState('');
  const [positiveAttestations, setPositiveAttestations] = useState('');
  const [negativeAttestations, setNegativeAttestations] = useState('');
  const [attestationHistory, setAttestationHistory] = useState('');
  const [transactionHash, setTransactionHash] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch your environment variables
    const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

    // Initialize provider, wallet, and client
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const account = privateKeyToAccount(privateKey);
    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.baseSepolia,
      account: account,
    });

    try {
      const attestation = await client.createAttestation({
        schemaId: "your-schema-id", // Replace with your actual schema ID
        data: {
          contractAddress,
          reputationScore: parseInt(reputationScore),
          numberOfPositiveAttestations: parseInt(positiveAttestations),
          numberOfNegativeAttestations: parseInt(negativeAttestations),
          attestationHistory: attestationHistory.split(','),
        },
        indexingValue: contractAddress.toLowerCase(),
      });

      setTransactionHash(attestation.txHash);
      alert("Attestation created successfully!");
    } catch (error) {
      console.error("Error creating attestation:", error);
      alert("Failed to create attestation.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Contract Address:</label>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Reputation Score:</label>
        <input
          type="number"
          value={reputationScore}
          onChange={(e) => setReputationScore(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Positive Attestations:</label>
        <input
          type="number"
          value={positiveAttestations}
          onChange={(e) => setPositiveAttestations(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Negative Attestations:</label>
        <input
          type="number"
          value={negativeAttestations}
          onChange={(e) => setNegativeAttestations(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Attestation History (comma separated):</label>
        <input
          type="text"
          value={attestationHistory}
          onChange={(e) => setAttestationHistory(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Attestation</button>
      {transactionHash && (
        <p>Transaction Hash: {transactionHash}</p>
      )}
    </form>
  );
}
