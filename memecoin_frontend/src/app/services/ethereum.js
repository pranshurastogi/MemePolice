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

export const fetchMemecoinDetails = async (address) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
      );
  
      // Ensure the response structure is valid and contains market data
      if (response.data && response.data.market_data && response.data.market_data.current_price) {
        const { name, symbol, market_data } = response.data;
        return {
          name,
          symbol,
          price: market_data.current_price.usd ? parseFloat(market_data.current_price.usd) : 0, // Parse to float
        };
      } else {
        throw new Error("Invalid data structure returned from API");
      }
    } catch (error) {
      console.error("Error fetching memecoin details:", error);
      return { name: "Unknown", symbol: "UNKNOWN", price: 0.0000 };
    }
  };
  
export const fetchTopHolders = async (address) => {
  try {
    const response = await axios.get(
      `https://api.ethplorer.io/getTopTokenHolders/${address}?apiKey=freekey&limit=3`
    );
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

  if (price < 0.0010) {
    score += 40; // Add 40 points if the price is less than $0.0010
  }

  const topHolderTotalPercentage = topHolders.reduce((total, holder) => total + holder.percentage, 0);
  if (topHolderTotalPercentage > 50) {
    score += 40; // Add 40 points if top 3 holders hold more than 50%
  }

  score += transactions.length > 100 ? 20 : 0; // Add additional criteria based on the number of transactions

  return score;
};
