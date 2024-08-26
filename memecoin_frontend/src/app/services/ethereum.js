import { ethers } from "ethers";
import axios from "axios";

const alchemyProvider = new ethers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export const fetchContractCode = async (address) => {
  try {
    const code = await alchemyProvider.getCode(address);
    console.log("Fetched code", code);
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
    console.log("RESPONS /n", response.data.result);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching contract history:", error);
    return [];
  }
};

export const fetchMemecoinPrice = async (address) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=usd`
    );
    const price = response.data[address.toLowerCase()]?.usd || 0;
    console.log("Coingecko",response)
    return price;
  } catch (error) {
    console.error("Error fetching memecoin price:", error);
    return "0.0000";
  }
};

export const fetchTopHolders = async (address) => {
  try {
    const response = await axios.get(
      `https://api.ethplorer.io/getTopTokenHolders/${address}?apiKey=freekey&limit=3`
      
    );
    console.log("ETHHPPLOOo",response)

    const holders = response.data.holders.map(holder => ({
      address: holder.address,
      percentage: holder.share,
    }));
    return holders;
  } catch (error) {
    console.error("Error fetching top holders:", error);
    return [];
  }
};

export const calculateRiskScore = (transactions, price, topHolders) => {
  let score = 0;

  if (price < 0.001) {
    score += 40; // Add 40 points if the price is less than $0.001
  }

  const topHolderTotalPercentage = topHolders.reduce((total, holder) => total + holder.percentage, 0);
  if (topHolderTotalPercentage > 50) {
    score += 40; // Add 40 points if top 3 holders hold more than 50%
  }

  score += transactions.length > 100 ? 20 : 0; // Add additional criteria based on the number of transactions

  return score;
};
