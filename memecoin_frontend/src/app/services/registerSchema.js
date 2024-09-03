import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { Wallet, JsonRpcProvider } from "ethers"; 

export const registerSchema = async () => {
  const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SIGN_PROTOCOL_RPC_URL);
  const wallet = new Wallet(process.env.NEXT_PUBLIC_SIGN_PROTOCOL_PRIVATE_KEY, provider);

  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.baseSepolia,
    account: privateKeyToAccount(wallet.privateKey),
  });

  try {
    const res = await client.createSchema({
      name: "ContractReputation",
      data: [
        { name: "ContractAddress", type: "string" },
        { name: "ReputationScore", type: "uint8" },
        { name: "NumberOfPositiveAttestations", type: "uint256" },
        { name: "NumberOfNegativeAttestations", type: "uint256" },
        { name: "AttestationHistory", type: "array" }
      ],
    });

    console.log(`Schema registered with ID: ${res.schemaId}`);
    console.log(`Transaction hash: ${res.txHash}`);
  } catch (error) {
    console.error("Error registering schema:", error);
  }
};
