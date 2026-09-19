/**
 * Pure mathematical & tax calculation engine for Investment Assets:
 * Saham (Indonesian Stocks / IDX), Emas (Physical Gold / Antam), and Kripto (Crypto / PMK 68).
 */

// ==========================================
// 1. SAHAM (INDONESIAN STOCKS)
// ==========================================

export interface SahamTradingInput {
  buyPrice: number;
  sellPrice: number;
  lots: number;
  feeBuyPct: number;
  feeSellPct: number;
}

export interface SahamTradingResult {
  sharesCount: number;
  grossBuy: number;
  feeBuyAmount: number;
  ppnBuyAmount: number;
  totalCostBuy: number;
  grossSell: number;
  feeSellAmount: number;
  ppnSellAmount: number;
  pphSellAmount: number;
  netReceived: number;
  netProfit: number;
  roi: number;
  bepPrice: number;
}

export function calculateSahamTrading(input: SahamTradingInput): SahamTradingResult {
  const { buyPrice, sellPrice, lots, feeBuyPct, feeSellPct } = input;
  const safeLots = Math.max(0, lots);
  const safeBuyPrice = Math.max(0, buyPrice);
  const safeSellPrice = Math.max(0, sellPrice);
  const safeFeeBuy = Math.max(0, feeBuyPct);
  const safeFeeSell = Math.max(0, feeSellPct);

  const sharesCount = safeLots * 100;
  const grossBuy = sharesCount * safeBuyPrice;
  const feeBuyAmount = (safeFeeBuy / 100) * grossBuy;
  const ppnBuyAmount = feeBuyAmount * 0.11; // 11% PPN on broker fee
  const totalCostBuy = grossBuy + feeBuyAmount + ppnBuyAmount;

  const grossSell = sharesCount * safeSellPrice;
  const feeSellAmount = (safeFeeSell / 100) * grossSell;
  const ppnSellAmount = feeSellAmount * 0.11; // 11% PPN on broker fee
  const pphSellAmount = 0.001 * grossSell; // 0.1% Final PPh
  const netReceived = grossSell - feeSellAmount - ppnSellAmount - pphSellAmount;

  const netProfit = netReceived - totalCostBuy;
  const roi = totalCostBuy > 0 ? (netProfit / totalCostBuy) * 100 : 0;

  const rateSellMultiplier = 1 - (safeFeeSell / 100) * 1.11 - 0.001;
  const bepPrice =
    sharesCount > 0 && rateSellMultiplier > 0
      ? Math.ceil(totalCostBuy / (sharesCount * rateSellMultiplier))
      : 0;

  return {
    sharesCount,
    grossBuy,
    feeBuyAmount,
    ppnBuyAmount,
    totalCostBuy,
    grossSell,
    feeSellAmount,
    ppnSellAmount,
    pphSellAmount,
    netReceived,
    netProfit,
    roi,
    bepPrice,
  };
}

export interface GrahamValuationInput {
  currentPrice: number;
  eps: number;
  bvps: number;
}

export interface GrahamValuationResult {
  grahamNumber: number;
  mosPercent: number;
  status: "undervalued" | "fair" | "overvalued";
  impliedPE: number;
  impliedPBV: number;
}

export function calculateGrahamValuation(input: GrahamValuationInput): GrahamValuationResult {
  const { currentPrice, eps, bvps } = input;
  const isValid = eps > 0 && bvps > 0;
  const grahamNumber = isValid ? Math.round(Math.sqrt(22.5 * eps * bvps)) : 0;
  const mosPercent =
    grahamNumber > 0 ? ((grahamNumber - currentPrice) / grahamNumber) * 100 : isValid ? 0 : -100;
  const status: "undervalued" | "fair" | "overvalued" = !isValid
    ? "overvalued"
    : mosPercent >= 20
      ? "undervalued"
      : mosPercent >= 0
        ? "fair"
        : "overvalued";
  const impliedPE = eps > 0 ? currentPrice / eps : 0;
  const impliedPBV = bvps > 0 ? currentPrice / bvps : 0;

  return {
    grahamNumber,
    mosPercent,
    status,
    impliedPE,
    impliedPBV,
  };
}

export interface AverageDownInput {
  initialLots: number;
  initialPrice: number;
  newLots: number;
  newPrice: number;
}

export interface AverageDownResult {
  initialCapital: number;
  additionalCapital: number;
  totalLotsAfter: number;
  totalSharesAfter: number;
  totalCapitalAfter: number;
  newAveragePrice: number;
  priceReductionPercent: number;
  reboundNeededPercent: number;
}

export function calculateAverageDown(input: AverageDownInput): AverageDownResult {
  const { initialLots, initialPrice, newLots, newPrice } = input;
  const safeInitLots = Math.max(0, initialLots);
  const safeInitPrice = Math.max(0, initialPrice);
  const safeNewLots = Math.max(0, newLots);
  const safeNewPrice = Math.max(0, newPrice);

  const initialCapital = safeInitLots * 100 * safeInitPrice;
  const additionalCapital = safeNewLots * 100 * safeNewPrice;
  const totalLotsAfter = safeInitLots + safeNewLots;
  const totalSharesAfter = totalLotsAfter * 100;
  const totalCapitalAfter = initialCapital + additionalCapital;

  const newAveragePrice =
    totalSharesAfter > 0 ? Math.round(totalCapitalAfter / totalSharesAfter) : 0;
  const priceReductionPercent =
    safeInitPrice > 0 ? ((safeInitPrice - newAveragePrice) / safeInitPrice) * 100 : 0;
  const reboundNeededPercent =
    safeNewPrice > 0 ? ((newAveragePrice - safeNewPrice) / safeNewPrice) * 100 : 0;

  return {
    initialCapital,
    additionalCapital,
    totalLotsAfter,
    totalSharesAfter,
    totalCapitalAfter,
    newAveragePrice,
    priceReductionPercent,
    reboundNeededPercent,
  };
}

export interface DividendPlannerInput {
  stockPrice: number;
  dps: number;
  lots: number;
  taxOption: "reguler" | "exempt";
  targetMonthly: number;
}

export interface DividendPlannerResult {
  totalShares: number;
  totalCapital: number;
  taxRate: number;
  netDps: number;
  annualGross: number;
  annualNet: number;
  monthlyNet: number;
  dividendYieldNet: number;
  targetAnnual: number;
  requiredShares: number;
  requiredLots: number;
  requiredCapital: number;
}

export function calculateDividendPlanner(input: DividendPlannerInput): DividendPlannerResult {
  const { stockPrice, dps, lots, taxOption, targetMonthly } = input;
  const safeStockPrice = Math.max(0, stockPrice);
  const safeDps = Math.max(0, dps);
  const safeLots = Math.max(0, lots);
  const safeTargetMonthly = Math.max(0, targetMonthly);

  const totalShares = safeLots * 100;
  const totalCapital = totalShares * safeStockPrice;
  const taxRate = taxOption === "reguler" ? 0.1 : 0.0;
  const netDps = safeDps * (1 - taxRate);

  const annualGross = totalShares * safeDps;
  const annualNet = totalShares * netDps;
  const monthlyNet = annualNet / 12;
  const dividendYieldNet = safeStockPrice > 0 ? (netDps / safeStockPrice) * 100 : 0;

  const targetAnnual = safeTargetMonthly * 12;
  const requiredShares = netDps > 0 ? Math.ceil(targetAnnual / netDps) : 0;
  const requiredLots = Math.ceil(requiredShares / 100);
  const requiredCapital = requiredShares * safeStockPrice;

  return {
    totalShares,
    totalCapital,
    taxRate,
    netDps,
    annualGross,
    annualNet,
    monthlyNet,
    dividendYieldNet,
    targetAnnual,
    requiredShares,
    requiredLots,
    requiredCapital,
  };
}

// ==========================================
// 2. EMAS (PHYSICAL GOLD)
// ==========================================

export interface EmasInvestmentInput {
  weightGrams: number;
  priceBuyPerGram: number;
  priceSellPerGram: number;
  npwpStatus: "npwp" | "no-npwp";
}

export interface EmasInvestmentResult {
  grossBuy: number;
  buyTaxRate: number;
  buyTaxAmount: number;
  totalCostBuy: number;
  grossSell: number;
  sellTaxRate: number;
  sellTaxAmount: number;
  netReceived: number;
  netProfit: number;
  roi: number;
  spreadNominal: number;
  spreadPercent: number;
  bepSellPricePerGram: number;
}

export function calculateEmasInvestment(input: EmasInvestmentInput): EmasInvestmentResult {
  const { weightGrams, priceBuyPerGram, priceSellPerGram, npwpStatus } = input;
  const safeWeight = Math.max(0, weightGrams);
  const safePriceBuy = Math.max(0, priceBuyPerGram);
  const safePriceSell = Math.max(0, priceSellPerGram);

  const grossBuy = safeWeight * safePriceBuy;
  const buyTaxRate = npwpStatus === "npwp" ? 0.0045 : 0.009; // PPh 22: 0.45% vs 0.90%
  const buyTaxAmount = Math.round(buyTaxRate * grossBuy);
  const totalCostBuy = grossBuy + buyTaxAmount;

  const grossSell = safeWeight * safePriceSell;
  // PPh 22 on sell/buyback is 1.5% (NPWP) or 3% (No NPWP) ONLY if total transaction exceeds Rp 10 million (PMK 34/2017)
  const sellTaxRate = grossSell > 10000000 ? (npwpStatus === "npwp" ? 0.015 : 0.03) : 0;
  const sellTaxAmount = Math.round(sellTaxRate * grossSell);
  const netReceived = grossSell - sellTaxAmount;

  const netProfit = netReceived - totalCostBuy;
  const roi = totalCostBuy > 0 ? (netProfit / totalCostBuy) * 100 : 0;

  const spreadNominal = safePriceBuy - safePriceSell;
  const spreadPercent = safePriceBuy > 0 ? (spreadNominal / safePriceBuy) * 100 : 0;

  // BEP: what sell price per gram is needed so that netReceived = totalCostBuy?
  let bepSellPricePerGram = 0;
  if (safeWeight > 0) {
    if (totalCostBuy > 10000000) {
      const taxRateApplicable = npwpStatus === "npwp" ? 0.015 : 0.03;
      const bepGrossNeeded = totalCostBuy / (1 - taxRateApplicable);
      bepSellPricePerGram = Math.ceil(bepGrossNeeded / safeWeight);
    } else {
      bepSellPricePerGram = Math.ceil(totalCostBuy / safeWeight);
    }
  }

  return {
    grossBuy,
    buyTaxRate,
    buyTaxAmount,
    totalCostBuy,
    grossSell,
    sellTaxRate,
    sellTaxAmount,
    netReceived,
    netProfit,
    roi,
    spreadNominal,
    spreadPercent,
    bepSellPricePerGram,
  };
}

// ==========================================
// 3. KRIPTO (CRYPTO ASSETS / PMK 68)
// ==========================================

export interface CryptoTradingInput {
  amountCoins: number;
  priceBuy: number;
  priceSell: number;
  feeBuyPct: number;
  feeSellPct: number;
  taxType: "bappebti" | "non-bappebti";
}

export interface CryptoTradingResult {
  grossBuy: number;
  feeBuyAmount: number;
  taxRate: number;
  buyTaxAmount: number;
  totalCostBuy: number;
  grossSell: number;
  feeSellAmount: number;
  sellTaxAmount: number;
  netReceived: number;
  netProfit: number;
  roi: number;
  bepPrice: number;
}

export function calculateCryptoTrading(input: CryptoTradingInput): CryptoTradingResult {
  const { amountCoins, priceBuy, priceSell, feeBuyPct, feeSellPct, taxType } = input;
  const safeAmount = Math.max(0, amountCoins);
  const safePriceBuy = Math.max(0, priceBuy);
  const safePriceSell = Math.max(0, priceSell);
  const safeFeeBuy = Math.max(0, feeBuyPct);
  const safeFeeSell = Math.max(0, feeSellPct);

  const grossBuy = safeAmount * safePriceBuy;
  const feeBuyAmount = Math.round((safeFeeBuy / 100) * grossBuy);
  // PMK 68/2022: Bappebti = PPh 0.1% + PPN 0.1% (0.2%); Non-Bappebti = PPh 0.2% + PPN 0.2% (0.4%)
  const taxRate = taxType === "bappebti" ? 0.002 : 0.004;
  const buyTaxAmount = Math.round(taxRate * grossBuy);
  const totalCostBuy = grossBuy + feeBuyAmount + buyTaxAmount;

  const grossSell = safeAmount * safePriceSell;
  const feeSellAmount = Math.round((safeFeeSell / 100) * grossSell);
  const sellTaxAmount = Math.round(taxRate * grossSell);
  const netReceived = grossSell - feeSellAmount - sellTaxAmount;

  const netProfit = netReceived - totalCostBuy;
  const roi = totalCostBuy > 0 ? (netProfit / totalCostBuy) * 100 : 0;

  const rateMultiplier = 1 - safeFeeSell / 100 - taxRate;
  const bepPrice =
    safeAmount > 0 && rateMultiplier > 0
      ? Math.ceil(totalCostBuy / (safeAmount * rateMultiplier))
      : 0;

  return {
    grossBuy,
    feeBuyAmount,
    taxRate,
    buyTaxAmount,
    totalCostBuy,
    grossSell,
    feeSellAmount,
    sellTaxAmount,
    netReceived,
    netProfit,
    roi,
    bepPrice,
  };
}
