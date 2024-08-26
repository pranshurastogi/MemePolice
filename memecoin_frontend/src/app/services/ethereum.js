import { ethers } from "ethers";
import axios from "axios";

const alchemyProvider = new ethers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export const fetchContractCode = async (address) => {
  try {
    const code = await alchemyProvider.getCode(address);
    console.log("Fetched code", code)
    return code;
  } catch (error) {
    console.error("Error fetching contract code:", error);
    return "0x";
  }
};

export const fetchContractHistory = async (address) => {
  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
    );
    console.log("RESPONS /n",response.data.result, response)
    return response.data.result;
  } catch (error) {
    console.error("Error fetching contract history:", error);
    return [];
  }
};

export const calculateRiskScore = (transactions) => {
  // Placeholder for your custom risk score logic
  // For now, let's just use a simple heuristic: the more transactions, the lower the risk
  const score = transactions.length > 100 ? 20 : 80; // Example logic
  return score;
};
