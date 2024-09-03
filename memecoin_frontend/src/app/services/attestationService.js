import { ethers } from "ethers";
import { SignProtocolClient, SpMode, EvmChains } from '@ethsign/sp-sdk';

const schemaId = "0x88"; // Example schema ID for the counter

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    console.log("Initializing BrowserProvider with window.ethereum");
    return new ethers.BrowserProvider(window.ethereum);
  }
  console.error("Ethereum object not found, ensure MetaMask is installed.");
  return null;
};

export const getSchemaDetails = async () => {
  const provider = getProvider();
  if (!provider) {
    const errorMessage = "Failed to initialize provider.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const signer = await provider.getSigner();
  console.log("Signer obtained:", signer);
  
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.sepolia,
    account: signer
  });

  try {
    console.log("Fetching schema details for schema ID:", schemaId);
    const schemaDetails = await client.getSchema(schemaId);
    console.log("Schema details fetched:", schemaDetails);
    return schemaDetails;
  } catch (error) {
    console.error('Failed to fetch schema details:', error);
    throw new Error("Failed to fetch schema details from blockchain.");
  }
};


