/**
 * Quantitative Financial Math Library for Traders
 * Formulated by Tim Saham (Richard CIO, Arya Technical, Bramantyo CRO)
 * Implemented by Tim Dev (Bryan Backend, Fiqry Frontend)
 */

export interface TpTierConfig {
  percentOfPosition: number; // e.g. 50 (for 50%)
  riskRewardRatio: number;   // e.g. 1.5 (for 1:1.5)
}

export interface ScaleOutResultTier {
  tierIndex: number;
  targetPrice: number;
  lots: number;
  targetProfit: number;
  riskReward: number;
  percentage: number;
}

export interface ScaleOutResult {
  riskPerUnit: number;
  totalRiskAmount: number;
  totalLots: number;
  tiers: ScaleOutResultTier[];
  totalExpectedProfit: number;
  blendedRiskReward: number;
  bepTriggerLot: number;
  bepAdvice: string;
}

/**
 * Calculates Multi-Exit / Partial Take Profit Scale-Out targets
 */
export function calculateScaleOutTP(
  entryPrice: number,
  stopLossPrice: number,
  totalUnits: number,
  direction: "LONG" | "SHORT" = "LONG",
  tpTiers: TpTierConfig[] = [
    { percentOfPosition: 50, riskRewardRatio: 1.5 },
    { percentOfPosition: 30, riskRewardRatio: 2.5 },
    { percentOfPosition: 20, riskRewardRatio: 4.0 },
  ],
  unitMultiplier: number = 100 // 100 shares per lot for saham, 1 for forex/crypto
): ScaleOutResult {
  if (entryPrice <= 0 || stopLossPrice <= 0 || totalUnits <= 0) {
    return {
      riskPerUnit: 0,
      totalRiskAmount: 0,
      totalLots: 0,
      tiers: [],
      totalExpectedProfit: 0,
      blendedRiskReward: 0,
      bepTriggerLot: 0,
      bepAdvice: "Input tidak valid. Harap masukkan harga dan posisi yang valid.",
    };
  }

  const isLong = direction === "LONG";
  const riskPerUnit = isLong
    ? Math.max(0, entryPrice - stopLossPrice)
    : Math.max(0, stopLossPrice - entryPrice);

  const totalRiskAmount = riskPerUnit * totalUnits * unitMultiplier;

  let totalAllocatedUnits = 0;
  let totalProfitAcc = 0;

  const tiers: ScaleOutResultTier[] = tpTiers.map((cfg, idx) => {
    const isLastTier = idx === tpTiers.length - 1;
    // Calculate units for this tier
    const rawUnits = (totalUnits * cfg.percentOfPosition) / 100;
    const units = isLastTier
      ? Math.max(0, totalUnits - totalAllocatedUnits)
      : Math.max(0, Math.round(rawUnits));

    totalAllocatedUnits += units;

    // Target price based on R:R
    const targetDistance = riskPerUnit * cfg.riskRewardRatio;
    const targetPrice = isLong
      ? entryPrice + targetDistance
      : Math.max(0, entryPrice - targetDistance);

    const profit = targetDistance * units * unitMultiplier;
    totalProfitAcc += profit;

    return {
      tierIndex: idx + 1,
      targetPrice: Math.round(targetPrice * 100) / 100,
      lots: units,
      targetProfit: Math.round(profit),
      riskReward: cfg.riskRewardRatio,
      percentage: cfg.percentOfPosition,
    };
  });

  const blendedRiskReward =
    totalRiskAmount > 0 ? Math.round((totalProfitAcc / totalRiskAmount) * 100) / 100 : 0;

  const bepAdvice =
    tiers.length > 0
      ? `Saat TP1 tercapai (${tiers[0].lots} lot/unit di harga ${tiers[0].targetPrice}), segera geser Stop Loss sisa posisi ke harga Entry (${entryPrice}) untuk mengunci posisi bebas risiko (Risk-Free Trade).`
      : "";

  return {
    riskPerUnit: Math.round(riskPerUnit * 100) / 100,
    totalRiskAmount: Math.round(totalRiskAmount),
    totalLots: totalUnits,
    tiers,
    totalExpectedProfit: Math.round(totalProfitAcc),
    blendedRiskReward,
    bepTriggerLot: tiers.length > 0 ? tiers[0].lots : 0,
    bepAdvice,
  };
}

export interface AtrVolatilityResult {
  stopLossDistance: number;
  recommendedStopLoss: number;
  recommendedTp1: number;
  recommendedTp2: number;
  recommendedTp3: number;
  volatilityBufferPercent: number;
}

/**
 * Calculates Dynamic Volatility Stop Loss & Target using Average True Range (ATR)
 */
export function calculateAtrVolatilityStop(
  currentPrice: number,
  atrValue: number,
  multiplier: number = 1.5,
  direction: "LONG" | "SHORT" = "LONG"
): AtrVolatilityResult {
  if (currentPrice <= 0 || atrValue <= 0 || multiplier <= 0) {
    return {
      stopLossDistance: 0,
      recommendedStopLoss: 0,
      recommendedTp1: 0,
      recommendedTp2: 0,
      recommendedTp3: 0,
      volatilityBufferPercent: 0,
    };
  }

  const isLong = direction === "LONG";
  const stopLossDistance = atrValue * multiplier;
  const recommendedStopLoss = isLong
    ? Math.max(0, currentPrice - stopLossDistance)
    : currentPrice + stopLossDistance;

  const recommendedTp1 = isLong
    ? currentPrice + stopLossDistance * 1.5
    : Math.max(0, currentPrice - stopLossDistance * 1.5);

  const recommendedTp2 = isLong
    ? currentPrice + stopLossDistance * 2.5
    : Math.max(0, currentPrice - stopLossDistance * 2.5);

  const recommendedTp3 = isLong
    ? currentPrice + stopLossDistance * 4.0
    : Math.max(0, currentPrice - stopLossDistance * 4.0);

  const volatilityBufferPercent =
    currentPrice > 0 ? (stopLossDistance / currentPrice) * 100 : 0;

  return {
    stopLossDistance: Math.round(stopLossDistance * 100) / 100,
    recommendedStopLoss: Math.round(recommendedStopLoss * 100) / 100,
    recommendedTp1: Math.round(recommendedTp1 * 100) / 100,
    recommendedTp2: Math.round(recommendedTp2 * 100) / 100,
    recommendedTp3: Math.round(recommendedTp3 * 100) / 100,
    volatilityBufferPercent: Math.round(volatilityBufferPercent * 100) / 100,
  };
}

export interface KellyResult {
  payoffRatio: number;
  fullKellyPct: number;
  halfKellyPct: number;
  quarterKellyPct: number;
  recommendedRiskPct: number;
  status: "safe" | "caution" | "negative";
  message: string;
}

/**
 * Calculates Kelly Criterion & Fractional Sizing
 * Formula: K% = W - (1 - W) / R
 * where W = Win Rate (0-1), R = Payoff Ratio (Avg Win / Avg Loss)
 */
export function calculateKellyCriterion(
  winRatePct: number,
  avgWinAmount: number,
  avgLossAmount: number
): KellyResult {
  if (winRatePct <= 0 || avgWinAmount <= 0 || avgLossAmount <= 0) {
    return {
      payoffRatio: 0,
      fullKellyPct: 0,
      halfKellyPct: 0,
      quarterKellyPct: 0,
      recommendedRiskPct: 0,
      status: "negative",
      message: "Data statistik tidak lengkap atau bernilai nol. Masukkan nilai yang valid.",
    };
  }

  const W = Math.min(100, Math.max(0, winRatePct)) / 100;
  const R = avgWinAmount / avgLossAmount;

  // Kelly formula: K = W - (1 - W) / R
  const fullKelly = W - (1 - W) / R;
  const fullKellyPct = Math.round(fullKelly * 10000) / 100;
  const halfKellyPct = Math.round((fullKellyPct / 2) * 100) / 100;
  const quarterKellyPct = Math.round((fullKellyPct / 4) * 100) / 100;

  if (fullKelly <= 0) {
    return {
      payoffRatio: Math.round(R * 100) / 100,
      fullKellyPct: 0,
      halfKellyPct: 0,
      quarterKellyPct: 0,
      recommendedRiskPct: 0,
      status: "negative",
      message:
        "Sistem ini memiliki nilai ekspektasi negatif (Kelly <= 0%). Jangan gunakan leverage atau pertimbangkan perbaiki Win Rate / Rasio R:R sebelum trading uang riil.",
    };
  }

  // Institutional risk cap: maximum recommended risk per trade is 2% - 3% even if Kelly is higher
  const recommendedRiskPct = Math.min(2.5, Math.max(0.5, halfKellyPct));

  let status: "safe" | "caution" | "negative" = "safe";
  let message = `Sistem memiliki positive edge matematis. Rekomendasi Half-Kelly alokasi risiko modal per trade adalah ${recommendedRiskPct}% (maksimal batas aman psikologis 2-3%).`;

  if (fullKellyPct > 25) {
    status = "caution";
    message = `Full Kelly (${fullKellyPct}%) sangat agresif dan rentan drawdown dalam. Disarankan menerapkan Half-Kelly (${halfKellyPct}%) atau batas ketat ${recommendedRiskPct}% per transaksi.`;
  }

  return {
    payoffRatio: Math.round(R * 100) / 100,
    fullKellyPct,
    halfKellyPct,
    quarterKellyPct,
    recommendedRiskPct,
    status,
    message,
  };
}

export interface TradeExpectancyResult {
  winRatePct: number;
  lossRatePct: number;
  expectancyPerTrade: number;
  expectancyRatio: number;
  projectedProfit100Trades: number;
  status: "positive" | "neutral" | "negative";
  verdict: string;
}

/**
 * Calculates Mathematical Trade Expectancy
 * Formula: E = (WinRate * AvgWin) - (LossRate * AvgLoss)
 */
export function calculateTradeExpectancy(
  winRatePct: number,
  avgWinAmount: number,
  avgLossAmount: number
): TradeExpectancyResult {
  const boundedWin = Math.min(100, Math.max(0, winRatePct));
  const winRate = boundedWin / 100;
  const lossRate = (100 - boundedWin) / 100;

  const expectancyPerTrade = winRate * avgWinAmount - lossRate * avgLossAmount;
  const projectedProfit100Trades = expectancyPerTrade * 100;

  // Expectancy Ratio = E / avgLossAmount
  const expectancyRatio =
    avgLossAmount > 0
      ? Math.round((expectancyPerTrade / avgLossAmount) * 100) / 100
      : 0;

  let status: "positive" | "neutral" | "negative" = "neutral";
  let verdict = "Sistem berada pada titik impas (Break-Even Expectancy).";

  if (expectancyPerTrade > 0) {
    status = "positive";
    verdict = `Keunggulan statistik positif (+${expectancyRatio}R per trade). Sistem ini secara matematis menguntungkan dalam seri transaksi panjang (Law of Large Numbers).`;
  } else if (expectancyPerTrade < 0) {
    status = "negative";
    verdict = `Ekspektasi negatif (-${Math.abs(expectancyRatio)}R per trade). Setiap transaksi mengurangi rata-rata modal Anda. Segera evaluasi strategi.`;
  }

  return {
    winRatePct: boundedWin,
    lossRatePct: Math.round((100 - boundedWin) * 10) / 10,
    expectancyPerTrade: Math.round(expectancyPerTrade * 100) / 100,
    expectancyRatio,
    projectedProfit100Trades: Math.round(projectedProfit100Trades),
    status,
    verdict,
  };
}

export interface RiskOfRuinResult {
  riskPerTradePct: number;
  ruinProbabilityPct: number;
  consecutiveLossesTo20Pct: number;
  consecutiveLossesTo50Pct: number;
  status: "minimal" | "moderate" | "critical";
  advice: string;
}

/**
 * Calculates Risk of Ruin & Drawdown Vulnerability
 */
export function calculateRiskOfRuin(
  riskPerTradePct: number,
  winRatePct: number,
  payoffRatio: number
): RiskOfRuinResult {
  const boundedRisk = Math.max(0.1, Math.min(50, riskPerTradePct));
  const boundedWin = Math.max(1, Math.min(99, winRatePct)) / 100;
  const boundedLoss = 1 - boundedWin;

  // Consecutive losses calculations: (1 - risk)^N = targetRemaining
  // For 20% drawdown (remaining 0.8):
  const riskFraction = boundedRisk / 100;
  const consecutiveLossesTo20Pct =
    riskFraction > 0
      ? Math.ceil(Math.log(0.8) / Math.log(1 - riskFraction))
      : 0;

  // For 50% drawdown (remaining 0.5):
  const consecutiveLossesTo50Pct =
    riskFraction > 0
      ? Math.ceil(Math.log(0.5) / Math.log(1 - riskFraction))
      : 0;

  // Simplified Nauzer Balsara / Perry Kaufman asymptotic formula for Risk of Ruin:
  // Edge = W * R - (1 - W)
  const edge = boundedWin * payoffRatio - boundedLoss;
  let ruinProbabilityPct = 0;

  if (edge <= 0) {
    ruinProbabilityPct = 100;
  } else {
    // Ruin probability decreases exponentially as edge increases and risk fraction decreases
    // Approx: ((1 - Edge/R) / (1 + Edge/R)) ^ (CapitalUnits)
    // where CapitalUnits = 100 / boundedRisk
    const capitalUnits = 100 / boundedRisk;
    const ratio = Math.max(0, (1 - edge / (payoffRatio + 1)) / (1 + edge / (payoffRatio + 1)));
    const rawProb = Math.pow(ratio, Math.min(capitalUnits, 50)) * 100;
    ruinProbabilityPct = Math.min(100, Math.max(0, Math.round(rawProb * 10) / 10));
  }

  let status: "minimal" | "moderate" | "critical" = "minimal";
  let advice = "Tingkat risiko sangat aman (< 1% probabilitas kehancuran). Modal terlindungi secara matematis.";

  if (ruinProbabilityPct > 20 || boundedRisk > 5) {
    status = "critical";
    advice = `BAHAYA: Risiko per transaksi (${boundedRisk}%) terlalu besar atau sistem tidak memiliki statistical edge. Anda hanya butuh ${consecutiveLossesTo20Pct}x rugi beruntun untuk drawdown 20%!`;
  } else if (ruinProbabilityPct > 5 || boundedRisk > 2.5) {
    status = "moderate";
    advice = `Waspada: Probabilitas drawdown cukup signifikan. Turunkan risiko ke rentang 1% - 2% per transaksi.`;
  }

  return {
    riskPerTradePct: boundedRisk,
    ruinProbabilityPct,
    consecutiveLossesTo20Pct,
    consecutiveLossesTo50Pct,
    status,
    advice,
  };
}

export interface CompoundingMilestone {
  period: number;
  startBalance: number;
  targetProfit: number;
  endBalance: number;
  maxDrawdownBudget: number;
}

export interface CompoundingGrowthResult {
  initialCapital: number;
  finalBalance: number;
  netProfit: number;
  totalReturnPct: number;
  targetGrowthRatePct: number;
  periods: number;
  periodType: "week" | "month";
  milestones: CompoundingMilestone[];
}

/**
 * Calculates Account Compounding Growth Progression
 * Formula: A = P * (1 + r)^n
 */
export function calculateCompoundingGrowth(
  initialCapital: number,
  targetGrowthRatePct: number,
  periods: number = 12,
  periodType: "week" | "month" = "month",
  maxDrawdownTolerancePct: number = 10
): CompoundingGrowthResult {
  const boundedCapital = Math.max(0, initialCapital);
  const boundedGrowth = Math.max(0.1, Math.min(100, targetGrowthRatePct));
  const boundedPeriods = Math.max(1, Math.min(52, periods));
  const r = boundedGrowth / 100;

  const milestones: CompoundingMilestone[] = [];
  let currentBalance = boundedCapital;

  for (let i = 1; i <= boundedPeriods; i++) {
    const startBalance = currentBalance;
    const profit = startBalance * r;
    const endBalance = startBalance + profit;
    const maxDrawdownBudget = (endBalance * maxDrawdownTolerancePct) / 100;

    milestones.push({
      period: i,
      startBalance: Math.round(startBalance),
      targetProfit: Math.round(profit),
      endBalance: Math.round(endBalance),
      maxDrawdownBudget: Math.round(maxDrawdownBudget),
    });

    currentBalance = endBalance;
  }

  const finalBalance = Math.round(currentBalance);
  const netProfit = Math.round(finalBalance - boundedCapital);
  const totalReturnPct =
    boundedCapital > 0
      ? Math.round(((finalBalance - boundedCapital) / boundedCapital) * 10000) / 100
      : 0;

  return {
    initialCapital: boundedCapital,
    finalBalance,
    netProfit,
    totalReturnPct,
    targetGrowthRatePct: boundedGrowth,
    periods: boundedPeriods,
    periodType,
    milestones,
  };
}
