import { v4 as uuidv4 } from "uuid"; 
import { StableBTreeMap } from "azle"; 
import { time } from "azle";

// Represents an SME (Small Medium Enterprise) for fractional ownership
class SME {
  smeId!: string; 
  name!: string; 
  totalShares!: number; 
  sharesSold!: number; 
  pricePerShare!: number; 
  assets!: ReturnType<typeof StableBTreeMap<string, Asset>>; 
  investors!: ReturnType<typeof StableBTreeMap<string, number>>; 
}

// Represents an Asset that can be fractionally owned within an SME
class Asset {
  assetId!: string; 
  name!: string; 
  totalShares!: number; 
  sharesSold!: number; 
  valuePerShare!: number; 
  investors!: ReturnType<typeof StableBTreeMap<string, number>>; 
  smeId!: string; 
}

// StableBTreeMap is used for persistent storage across canister upgrades
const smeStorage = StableBTreeMap<string, SME>(0);
const assetStorage = StableBTreeMap<string, Asset>(1);

// Function to create a new SME
export function create_sme(name: string, totalShares: number, pricePerShare: number): string {
  validatePositiveNumber(totalShares, "Total shares");
  validatePositiveNumber(pricePerShare, "Price per share");
  if (name.trim().length === 0) {
    throw new Error("SME name cannot be empty");
  }
  const smeId = uuidv4(); 
  const newSME: SME = {
    smeId,
    name,
    totalShares,
    sharesSold: 0,
    pricePerShare,
    assets: StableBTreeMap<string, Asset>(2), 
    investors: StableBTreeMap<string, number>(3), 
  };
  smeStorage.insert(smeId, newSME); 
  console.log(`Created new SME with id: ${smeId}`);
  return smeId; 
}

// Function to register an asset for an SME
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
    investors: StableBTreeMap<string, number>(4), 
    smeId,
  };

  smeOpt.assets.insert(assetId, newAsset); 
  console.log(`Registered new asset with id: ${assetId}`);
  return assetId; 
}

// Function for investing in an SME (buying shares in the SME)
export function invest_in_sme(smeId: string, investorId: string, amount: number) {
  const smeOpt = smeStorage.get(smeId);
  if (!smeOpt) {
    throw new Error(`SME with id=${smeId} not found`);
  }

  const sharesToPurchase = Math.floor(amount / smeOpt.pricePerShare);
  if (smeOpt.sharesSold + sharesToPurchase > smeOpt.totalShares) {
    throw new Error("Not enough shares available for purchase");
  }

  // Update investor shares
  const currentShares = smeOpt.investors.get(investorId) || 0;
  smeOpt.investors.insert(investorId, currentShares + sharesToPurchase);
  
  smeOpt.sharesSold += sharesToPurchase;
  
  // Update storage
  smeStorage.insert(smeId, smeOpt);
  
  console.log(`Investor ${investorId} purchased ${sharesToPurchase} shares in SME ${smeId}`);
}

// Function for investing in an asset (buying shares in a specific asset)
export function invest_in_asset(smeId: string, assetId: string, investorId: string, amount: number) {
  const smeOpt = smeStorage.get(smeId);
  if (!smeOpt) {
    throw new Error(`SME with id=${smeId} not found`);
  }

  const assetOpt = smeOpt.assets.get(assetId);
  if (!assetOpt) {
    throw new Error(`Asset with id=${assetId} not found`);
  }

  const sharesToPurchase = Math.floor(amount / assetOpt.valuePerShare);
  if (assetOpt.sharesSold + sharesToPurchase > assetOpt.totalShares) {
    throw new Error("Not enough shares available for purchase in the asset");
  }

  // Update investor shares
  const currentShares = assetOpt.investors.get(investorId) || 0;
  assetOpt.investors.insert(investorId, currentShares + sharesToPurchase);
  
  assetOpt.sharesSold += sharesToPurchase;
  
  // Update storage
  smeOpt.assets.insert(assetId, assetOpt);
  smeStorage.insert(smeId, smeOpt);
  
  console.log(`Investor ${investorId} purchased ${sharesToPurchase} shares in asset ${assetId}`);
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

// Add these validation functions
function validatePositiveNumber(value: number, fieldName: string) {
  if (value <= 0) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
}

// Add new query functions
export function get_investor_sme_holdings(smeId: string, investorId: string): number {
  const sme = smeStorage.get(smeId);
  if (!sme) return 0;
  return sme.investors.get(investorId) || 0;
}

export function get_investor_asset_holdings(smeId: string, assetId: string, investorId: string): number {
  const sme = smeStorage.get(smeId);
  if (!sme) return 0;
  const asset = sme.assets.get(assetId);
  if (!asset) return 0;
  return asset.investors.get(investorId) || 0;
}
