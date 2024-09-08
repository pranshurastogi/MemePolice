# MemePolice
<img width="1440" alt="Screenshot 2024-09-08 at 3 38 32 PM" src="https://github.com/user-attachments/assets/ba049de2-0070-4a64-b19d-6116fe2cce0a">

# MemePolice: Memecoin Risk Analyzer

**MemePolice** is a decentralized application (dApp) designed to analyze the risk associated with memecoins. It leverages data from the Ethereum blockchain and performs advanced calculations to provide a detailed risk score based on various metrics such as price, market cap, volume, transaction activity, and holder concentration.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Risk Scoring Breakdown](#risk-scoring-breakdown)
- [Sign Protocol Integration](#sign-protocol-integration)
- [Why We Need MemePolice](#why-we-need-memepolice)
- [Tech Stack](#tech-stack)
- [How to Use](#how-to-use)
- [Installation](#installation)
- [Conclusions](#conclusions)

## Overview

With the rise of memecoins in the cryptocurrency market, investors face an increasing need for tools to assess the associated risks. **MemePolice** analyzes memecoin data on the Ethereum blockchain and computes a detailed risk score. This score helps users make informed decisions about whether to invest in or trade a specific token.

## Features

1. **Comprehensive Risk Scoring**: Calculates a detailed risk score based on multiple factors, such as price volatility, market cap, trading volume, holder concentration, transaction volume, and contract age.
2. **Attestation with Sign Protocol**: Leverages **Sign Protocol** to authenticate and secure the analysis results on the Ethereum blockchain.
3. **Dynamic Visualization**: Presents the risk analysis visually using a radar chart for easy interpretation of each factor's contribution to the overall risk score.

## Risk Scoring Breakdown

The risk scoring model in **MemePolice** evaluates multiple parameters. Here's how the score is computed:
## Risk Scoring Breakdown

**MemePolice** utilizes a multifaceted approach to risk evaluation, leveraging statistical methods and advanced mathematical modeling. Here's a breakdown of how the overall risk score is computed:

### Key Risk Factors:

1. **Price Volatility**:
   - **Logarithmic Scaling** to smoothen the impact of extreme price fluctuations. Lower token prices yield higher risk values.
   
2. **Market Cap Stability**:
   - An **Exponential Decay Function** is applied to reduce risk for larger market caps, showcasing the diminishing returns of increased capitalization on risk reduction.

3. **Volume Liquidity**:
   - Risk inversely correlates with volume, modeled using a **Square Root Function**, accounting for the diminishing influence of very high volumes.

4. **Holder Concentration**:
   - The **Holder Concentration Risk** uses a **Quadratic Function** to penalize high token concentration among a few holders, amplifying the risk in cases of potential manipulation.

5. **Transaction Activity**:
   - A **Logistic Growth Model** analyzes transaction data, wherein fewer transactions increase the risk score due to reduced liquidity and market participation.

6. **Contract Age**:
   - **Exponential Decay** over time is used to reduce the risk for older contracts, accounting for reduced vulnerability with age.

### Risk Breakdown Chart

To visualize how these parameters affect the overall score, **MemePolice** uses a **Radar Chart** for an intuitive representation. Each risk category—**Price, Market Cap, Volume, Holder Concentration, Transactions, and Contract Age**—is plotted on an axis to show its contribution to the final score.


- **Logarithmic Functions** smoothen price data, adjusting for extreme token values.
- **Exponential Decay** minimizes risk from larger market caps and older contracts.
- **Quadratic Penalization** for holder concentration ensures fairness in assessing the risk of market manipulation.

### Aggregate Final Score
<img width="374" alt="Screenshot 2024-09-08 at 3 40 21 PM" src="https://github.com/user-attachments/assets/512c7cc9-3b9b-4c6e-9eaa-7d6916cf0360">


## Sign Protocol Integration
<img width="712" alt="Screenshot 2024-09-08 at 3 44 36 PM" src="https://github.com/user-attachments/assets/1aeaad6e-eb8b-4a83-a247-fcfc6dee3653">

**MemePolice** integrates with **Sign Protocol** to securely store attestations and risk scores on the blockchain. This integration ensures transparency, immutability, and integrity in the risk analysis process. Here's how it works:

### Schema Setup
Each attestation follows a specific schema:
```javascript
const schemaId = "0x1e3"; // Unique identifier for the attestation schema
```

## Why We Need MemePolice
With the rise of memecoins, many tokens are speculative and prone to scams or harmful ideologies. MemePolice helps protect users by providing detailed risk analysis, ensuring informed investment decisions. Inspired by Vitalik Buterin's concept of charity coins and Robin Hood games, this tool is designed to encourage transparency in the chaotic world of memecoins.

Our mission is to assess the risk of speculative tokens, protect crypto enthusiasts, and promote a healthier, more sustainable crypto ecosystem.

The total risk score is the **Weighted Sum** of all the components, normalized between 0 and 100 using **Min-Max Normalization**.

By employing this mix of **statistical** and **algebraic models**, **MemePolice** ensures a robust analysis, safeguarding users from highly speculative or potentially fraudulent memecoins.

## Tech Stack
MemePolice uses the following technologies:

* Ethereum: Blockchain platform for decentralized transactions and data storage.
* Sign Protocol: Framework for attestations and securing data on-chain.
* Ethers.js: JavaScript library for interacting with the Ethereum blockchain.
* Next.js: React framework used to build the dApp's frontend.
* Alchemy: Ethereum API provider for retrieving blockchain data.

## Installation
Follow these steps to install and run MemePolice locally: 
1. Clone the repository:
```bash git clone https://github.com/yourusername/memepolice.git ```
2. Install dependencies:
```bash npm install ```
3. Create a .env file with the following contents:
```bash NEXT_PUBLIC_ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY NEXT_PUBLIC_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org ```
4. Start the development server:
```bash npm run dev ```


## Conclusion
MemePolice provides a vital tool for analyzing the risks of memecoins in the volatile cryptocurrency market. By offering detailed risk breakdowns and integrating with Sign Protocol for secure attestations, it allows users to make safer and more informed investment decisions. Whether you're a seasoned crypto trader or a new enthusiast, MemePolice helps protect you from the dangers of speculative and volatile tokens.

