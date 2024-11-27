
# SME Fractional Ownership

This is a cannister built on the Internet Computer Protocol (ICP). The application allows Small and Medium Enterprises (SMEs) to register and offer fractional ownership of their business and assets. The goal is to provide a platform for SMEs to raise funds by offering shares of their business or assets to the community.

### Features:
- **SME Registration**: Allows SMEs to register on the platform by specifying the name, total shares, and price per share.
- **Asset Registration**: SMEs can register assets (e.g., equipment, inventory, real estate) that are fractionalized and made available for investment.
- **Invest in SME**: Investors can purchase shares in SMEs based on the price per share set by the SME.
- **Invest in Assets**: Investors can also purchase shares in specific assets owned by the SMEs.
- **CRUD Operations**: Support for create, read, update, and delete operations for SMEs and assets.
- **Persistent Storage**: The project utilizes stable BTreeMap from Azle to ensure persistent storage of data across canister upgrades.

## Prerequisites

- **Node.js**: Ensure you have Node.js (version 20 or higher) installed on your machine. You can install it using [nvm](https://github.com/nvm-sh/nvm) or download it directly from [Node.js official website](https://nodejs.org/).
- **DFX**: The DFINITY SDK (`dfx`) is required for managing and deploying the canisters. You can install it by following the [DFX installation guide](https://sdk.dfinity.org/docs/developers-guide/install-upgrade-remove.html).

## Setup and Installation

Follow these steps to set up the project:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/svmueli/sme-fractional-ownership.git
   cd sme-fractional-ownership
   ```

2. **Install the dependencies**:

   Ensure you have `nvm` installed and the correct Node.js version active.

   Install the project dependencies:

   ```bash
   npm install
   ```

3. **Install DFX**:

   If you haven’t installed DFX, you can do so with the following commands:

   ```bash
   curl -fsSL https://sdk.dfinity.org/install.sh | sh
   ```

   After installation, verify that it's correctly installed by running:

   ```bash
   dfx --version
   ```

4. **Set up the local network**:

   You can use DFX to set up a local instance of the Internet Computer. Run the following command to start the local replica:

   ```bash
   dfx start --background
   ```

   This will start a local instance of the Internet Computer for development purposes.

5. **Deploy the canisters**:

   With the local replica running, deploy the canisters by running:

   ```bash
   dfx deploy
   ```

   This will deploy the `sme-fractional-ownership` canister to the local network.

## Running the Application

The application will be running on your local machine once deployed. Use the following command to start the local web server:

```bash
npm run start
```

The server will now be accessible at `http://localhost:8000`.

You can now interact with the endpoints to register SMEs, assets, and invest in them.

## API Endpoints

The following API endpoints are available:

- `POST /smes`: Register a new SME.
  - **Request body**:
    ```json
    {
      "name": "Cafe",
      "totalShares": 1000,
      "pricePerShare": 10
    }
    ```
  - **Response**:
    ```json
    {
      "smeId": "uuid",
      "name": "Cafe",
      "totalShares": 1000,
      "sharesSold": 0,
      "pricePerShare": 10
    }
    ```

- `POST /smes/:smeId/assets`: Register a new asset for the specified SME.
  - **Request body**:
    ```json
    {
      "name": "Coffee Machine",
      "value": 5000,
      "totalShares": 100
    }
    ```

- `POST /smes/:smeId/invest`: Invest in the SME by purchasing shares.
  - **Request body**:
    ```json
    {
      "amount": 100
    }
    ```

- `POST /smes/:smeId/assets/:assetId/invest`: Invest in a specific asset.
  - **Request body**:
    ```json
    {
      "amount": 100
    }
    ```

- `GET /smes`: Retrieve all SMEs.
  
- `GET /smes/:smeId`: Retrieve information about a specific SME by ID.
  
- `GET /smes/:smeId/assets`: Retrieve all assets for a specific SME.

- `GET /smes/:smeId/assets/:assetId`: Retrieve information about a specific asset by ID.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [DFINITY](https://dfinity.org) for the Internet Computer Protocol (ICP)
- [Azle](https://github.com/dfinity/azle) for the TypeScript framework for developing canisters
- [UUID](https://www.npmjs.com/package/uuid) for generating unique identifiers
```

