import { ethers } from "ethers";
import axios from "axios";

// Initialize Alchemy provider
const alchemyProvider = new ethers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

// Fetch contract code
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

// Fetch contract history
export const fetchContractHistory = async (address) => {
  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching contract history:", error);
    return [];
  }
};

// Fetch memecoin details
export const fetchMemecoinDetails = async (address) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
    );

    if (response.data && response.data.market_data && response.data.market_data.current_price) {
      const { name, symbol, market_data } = response.data;
      return {
        name,
        symbol,
        price: market_data.current_price.usd ? parseFloat(market_data.current_price.usd) : 0,
        marketCap: market_data.market_cap.usd,
        volume: market_data.total_volume.usd
      };
    } else {
      throw new Error("Invalid data structure returned from API");
    }
  } catch (error) {
    console.error("Error fetching memecoin details:", error);
    return { name: "Unknown", symbol: "UNKNOWN", price: 0.0000, marketCap: 0, volume: 0 };
  }
};

// Fetch top holders
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

// Fetch contract creation block
export const fetchContractCreationBlock = async (address) => {
  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
    );
    const creationTx = response.data.result[0];
    return creationTx ? creationTx.blockNumber : "Unknown";
  } catch (error) {
    console.error("Error fetching contract creation block:", error);
    return "Unknown";
  }
};

// Function to fetch the number of holders
export const fetchNumberOfHolders = async (address) => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=token&action=tokenholdercount&contractaddress=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
  console.log(response)
      if (response.data.status === "1") {
        return parseInt(response.data.result, 10); // Convert to integer
      } else {
        console.error("Error fetching number of holders:", response.data.message);
        return 0; // Return 0 if there's an issue
      }
    } catch (error) {
      console.error("Error fetching number of holders:", error);
      return 0; // Return 0 in case of error
    }
  };

// Calculate risk score
export const calculateRiskScore = (transactions, price, topHolders, marketCap, volume, numberOfHolders) => {
  let score = 0;

  if (price < 0.0010) {
    score += 40; // Add 40 points if the price is less than $0.0010
  }
  if (price < 0.0001) {
    score += 10; // Add 10 more points if the price is less than $0.0001
  }

  const topHolderTotalPercentage = topHolders.reduce((total, holder) => total + holder.percentage, 0);
  if (topHolderTotalPercentage > 50) {
    score += 40; // Add 40 points if top 3 holders hold more than 50%
  }

  if (marketCap < 1000000) {
    score += 20; // Add 20 points if market cap is less than $1 million
  }

  if (volume < 100000) {
    score += 10; // Add 10 points if trading volume is less than $100,000
  }

  if (numberOfHolders < 1000) {
    score += 20; // Add 20 points if the number of holders is less than 1000
  }

  score += transactions.length > 100 ? 20 : 0; // Add additional criteria based on the number of transactions

  return score;
};
