# Aurora TrustScanner

**Aurora TrustScanner** is a blockchain security tool designed for the **Aptos ecosystem**. It allows users to check the trustworthiness of smart contracts, helping to detect potentially malicious or risky contracts before interacting with them. The project integrates a React-based frontend with a backend analysis engine, and optionally, on-chain logging via a Move module.

## Features
 
- **Contract Scanner**: Input any Aptos smart contract address and receive a trust score indicating its safety.
- **Recent Activity Log**: Tracks the last few contracts checked for easy reference.
- **Notifications**: Optional alerts when risky contracts are detected.
- **Move Module Integration**: Store scan results on-chain for transparency and auditing (optional).
- **Aptos Wallet Support**: Compatible with browser wallets like Petra or Martian (optional).

## Technology Stack

- **Frontend**: React.js  
- **Backend**: Node.js / Express (API for contract analysis)  
- **Blockchain**: Aptos, Move module for on-chain data storage  
- **Browser Extension**: Chrome Extension with tabs for Dashboard, Scan, and Settings  

## How It Works

1. Users input a smart contract address in the extension or web dashboard.  
2. The backend analyzes the contract and returns a trust score.  
3. Results are displayed with a safe/risky indicator.  
4. Optional on-chain logging stores the scan result using a Move module.  
5. Recent scans are saved locally for quick reference, and notifications alert users to risky contracts.

## Installation & Setup

1. Clone the repository:  
   ```bash
   git clone https://github.com/sanga28/Aurora.git
   cd Aurora
2. Install dependencies: 
   ```bash
   npm install
3. Start the backend server:
   ```bash
   npm run server
4. Start the React frontend:
   ```bash
   npm start
5. Load the Chrome extension:
  - Open chrome://extensions
  - Enable Developer Mode
  - Click Load unpacked → select popup/ folder

## Usage
- Open the extension or web dashboard.
- Enter a smart contract address and click Scan Contract.
- View the trust score and risk status.
- Optional: Connect your Aptos wallet to store scan results on-chain.
- Recent scans appear in the activity log.
- Enable notifications to get alerts for risky contracts.

## Notes
- Currently supports Aptos testnet.
- Ensure your Aptos wallet is installed for optional on-chain scan logging.
- Backend analysis logic can be enhanced with advanced contract auditing rules.

## License

MIT License

