import { v4 as uuidv4 } from "uuid"; 
import { StableBTreeMap } from "azle"; 
import { time } from "azle"; /

// SME class that represents an SME
class SME {
  smeId: string; 
  name: string; 
  totalShares: number; 
  sharesSold: number; 
  pricePerShare: number; 
  assets: StableBTreeMap<string, Asset>; 
  investors: StableBTreeMap<string, number>; 
}

// Asset class that represents an asset owned by an SME
class Asset {
  assetId: string; 
  name: string; 
  totalShares: number; 
  sharesSold: number; 
  valuePerShare: number; 
  investors: StableBTreeMap<string, number>; 
  smeId: string; 
}

// Storage for SME & Asset data using StableBTreeMap for persistence
const smeStorage = StableBTreeMap<string, SME>(0);
const assetStorage = StableBTreeMap<string, Asset>(1);

// Function to create a new SME
export function create_sme(name: string, totalShares: number, pricePerShare: number): string {
  const smeId = uuidv4(); 
  const newSME: SME = {
    smeId,
    name,
    totalShares,
    sharesSold: 0,
    pricePerShare,
    assets: new StableBTreeMap<string, Asset>(1), 
    investors: new StableBTreeMap<string, number>(0), 
  };
  smeStorage.insert(smeId, newSME); 
  return smeId; 
}

// Function to register an asset for a given SME
export function register_asset(smeId: string, name: string, value: number, totalShares: number): string {
  const smeOpt = smeStorage.get(smeId); 
  if (!smeOpt) {
    throw new Error(`SME with id=${smeId} not found`); 
  }

  const assetId = uuidv4(); 
  const newAsset: Asset = {
    assetId,
    name,
    totalShares,
    sharesSold: 0,
    valuePerShare: value / totalShares, 
    investors: new StableBTreeMap<string, number>(0), 
    smeId,
  };

  smeOpt.assets.insert(assetId, newAsset); 
  return assetId; 
}

// Function for investing in an SME (buying shares in the SME)
export function invest_in_sme(smeId: string, amount: number) {
  const smeOpt = smeStorage.get(smeId); 
  if (!smeOpt) {
    throw new Error(`SME with id=${smeId} not found`); 
  }

  // Calculate how many shares the investor can buy based on the amount
  const sharesToPurchase = Math.floor(amount / smeOpt.pricePerShare);
  if (smeOpt.sharesSold + sharesToPurchase > smeOpt.totalShares) {
    throw new Error("Not enough shares available for purchase"); 
  }

  smeOpt.sharesSold += sharesToPurchase; 
}

// Function for investing in an asset (buying shares in a specific asset)
export function invest_in_asset(smeId: string, assetId: string, amount: number) {
  const smeOpt = smeStorage.get(smeId); 
  if (!smeOpt) {
    throw new Error(`SME with id=${smeId} not found`); 
  }

  const assetOpt = smeOpt.assets.get(assetId);
  if (!assetOpt) {
    throw new Error(`Asset with id=${assetId} not found`); 
  }

  // Calculate how many shares the investor can buy based on the amount
  const sharesToPurchase = Math.floor(amount / assetOpt.valuePerShare);
  if (assetOpt.sharesSold + sharesToPurchase > assetOpt.totalShares) {
    throw new Error("Not enough shares available for purchase in the asset"); 
  }

  assetOpt.sharesSold += sharesToPurchase; 
}

// Function to retrieve an SME by its ID
export function get_sme(smeId: string): SME | null {
  return smeStorage.get(smeId) || null; 
}

// Function to retrieve an asset by its ID within a specific SME
export function get_asset(smeId: string, assetId: string): Asset | null {
  const smeOpt = smeStorage.get(smeId); 
  if (!smeOpt) {
    return null; 
  }

  return smeOpt.assets.get(assetId) || null; 
}

// Helper function to get the current date and time
function getCurrentDate() {
  const timestamp = new Number(time()); 
  return new Date(timestamp.valueOf() / 1000_000); 
}
