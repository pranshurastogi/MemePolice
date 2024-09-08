import { SignProtocolClient, SpMode, EvmChains } from '@ethsign/sp-sdk';
import { ethers } from 'ethers';
import { onboard } from '../context/WalletContext'; // Ensure Web3-Onboard is initialized

const schemaId = "0x1e3"; // Schema ID
const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

// Function to connect the wallet using Web3-Onboard and return provider, signer, and account details
export const connectWallet = async () => {
  try {
    console.log("Connecting to wallet using Web3-Onboard...");
    const walletsConnected = await onboard.connectWallet();

    if (!walletsConnected.length) {
      throw new Error("No wallets connected. Please connect a wallet.");
    }

    const wallet = walletsConnected[0];
    const account = wallet.accounts[0].address;
    const ethersProvider = new ethers.BrowserProvider(wallet.provider);
    const signer = await ethersProvider.getSigner(account);

    console.log("Wallet connected. Account:", account);
    return { ethersProvider, signer, account };
  } catch (error) {
    console.error("Failed to connect wallet:", error.message);
    throw new Error("Please ensure MetaMask or another wallet is installed and connected.");
  }
};

// Function to get the signer using Web3-Onboard
export const getSigner = async () => {
  try {
    const { signer } = await connectWallet();
    if (!signer) throw new Error("Failed to retrieve the signer.");
    return signer;
  } catch (error) {
    console.error("Error fetching signer:", error.message);
    throw new Error("Failed to initialize the signer using Web3-Onboard.");
  }
};

// Function to fetch schema details
export const getSchemaDetails = async () => {
  try {
    const signer = await getSigner();
    const address = await signer.getAddress();
    console.log("Signer address:", address);

    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.sepolia,
      account: signer,
    });

    console.log("Fetching schema details for schema ID:", schemaId);
    const schemaDetails = await client.getSchema(schemaId);
    console.log("Schema details fetched:", schemaDetails);
    return schemaDetails;
  } catch (error) {
    console.error("Failed to fetch schema details:", error.message);
    throw new Error("Failed to fetch schema details from the blockchain.");
  }
};

// Function to create an attestation
export const createAttestation = async ({ AddressAttestator, XProfile, PositiveScore, NegativeScore, SentimentScore, Review, TokenOwner }) => {
  try {
    const { signer, account } = await connectWallet();
    if (!signer) throw new Error("Failed to initialize signer.");

    console.log("Signer address for attestation:", account);

    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.sepolia,
      account: signer,
    });

    // Prepare the attestation data according to the schema
    const attestationData = {
      schemaId,
      data: {
        AddressAttestator,             // string
        XProfile,                      // string
        PositiveScore: parseInt(PositiveScore, 10),  // uint256
        NegativeScore: parseInt(NegativeScore, 10),  // uint256
        SentimentScore: parseInt(SentimentScore, 10),  // uint256
        Review,                        // string
        TokenOwner                     // bool
      },
      indexingValue: account.toLowerCase(),
    };

    console.log("Prepared data for transaction:", JSON.stringify(attestationData));

    // Initiate MetaMask signing and create attestation
    const result = await client.createAttestation(attestationData, {
      from: account,
    });

    console.log("Attestation result:", result);
    return result;
  } catch (error) {
    console.error("Failed to create attestation:", error.message);
    throw new Error("Failed to create attestation on the blockchain.");
  }
};
