import { SignProtocolClient, SpMode, EvmChains } from '@ethsign/sp-sdk';
import { ethers } from 'ethers';

// Set the necessary environment variables
const schemaId = "0xa6"; // Schema ID
const privateKey = process.env.NEXT_PUBLIC_SIGN_PROTOCOL_PRIVATE_KEY;
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

// Function to get the signer using the private key or MetaMask
export const getSigner = async () => {
  if (privateKey) {
    console.log("Using private key from .env.local for signing");

    // Initialize ethers with a private key and RPC provider
    const provider = new ethers.JsonRpcProvider(sepoliaRpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Wallet initialized with address:", wallet.address);
    return wallet;
  } else if (typeof window !== 'undefined' && window.ethereum) {
    // Request account access if MetaMask is present
    console.log("Using MetaMask for signing");
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("MetaMask signer obtained:", await signer.getAddress());
    return signer;
  } else {
    console.error("Ethereum object not found, ensure MetaMask is installed or private key is provided.");
    return null;
  }
};

// Function to fetch schema details
export const getSchemaDetails = async () => {
  const signer = await getSigner();
  if (!signer) {
    throw new Error("Failed to initialize provider.");
  }

  const address = await signer.getAddress();
  console.log("Signer address:", address);

  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.sepolia,
    account: signer,
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

// Function to create an attestation
export const createAttestation = async ({ counter, decrease }) => {
  const signer = await getSigner();
  if (!signer) {
    throw new Error("Failed to initialize provider.");
  }

  const address = await signer.getAddress();
  console.log("Signer address for attestation:", address);

  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.sepolia,
    account: signer,
  });

  try {
    const attestationData = {
      schemaId,
      data: {
        counter: parseInt(counter, 10),
        decrease: parseInt(decrease, 10),
      },
      indexingValue: address.toLowerCase(),
    };

    console.log("Prepared data for transaction:", JSON.stringify(attestationData));

    // Create attestation on the blockchain
    const result = await client.createAttestation(attestationData);
    console.log("Attestation result:", result);
    return result;
  } catch (error) {
    console.error("Failed to create attestation:", error.message);
    throw new Error("Failed to create attestation on blockchain.");
  }
};
