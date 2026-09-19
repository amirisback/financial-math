/**
 * Pure Mathematical & Quantitative Logic for 18 Stock Trader Personas
 * Tim Saham (Bramantyo, Adrian, Arya, Clarissa, Darmawan) & Tim Dev (Bryan)
 */

import { TRADER_PERSONAS, GOLDEN_DOCTRINES, type TraderPersona } from "./trader-personas-data";

// 1. Scalper Ruin & Inverted RRR by Friction Fee BEI
export interface ScalperFeeResult {
  targetTickGain: number;
  stopTickLoss: number;
  grossGainPct: number;
  grossLossPct: number;
  netGainPct: number;
  netLossPct: number;
  theoreticalRrr: number;
  effectiveNetRrr: number;
  breakEvenWinRatePct: number;
  isInvertedRrr: boolean;
  verdictMessage: string;
}

export function calculateScalperFrictionRuin(
  targetTickGain: number,
  stopTickLoss: number,
  tickValuePercent: number = 0.40,
  roundTripFeePercent: number = 0.40
): ScalperFeeResult {
  const safeGainTicks = Math.max(1, targetTickGain);
  const safeLossTicks = Math.max(1, stopTickLoss);

  const grossGainPct = safeGainTicks * tickValuePercent;
  const grossLossPct = safeLossTicks * tickValuePercent;

  const netGainPct = Math.max(0.001, grossGainPct - roundTripFeePercent);
  const netLossPct = grossLossPct + roundTripFeePercent;

  const theoreticalRrr = grossLossPct > 0 ? Number((grossGainPct / grossLossPct).toFixed(2)) : 1;
  const effectiveNetRrr = netLossPct > 0 ? Number((netGainPct / netLossPct).toFixed(2)) : 0.5;

  // Formula Break-Even Win Rate: Loss / (Gain + Loss)
  const breakEvenWinRatePct = Number(
    ((netLossPct / (netGainPct + netLossPct)) * 100).toFixed(1)
  );

  const isInvertedRrr = effectiveNetRrr < 1.0;

  let verdictMessage = "Profil RRR positif dan masih menguntungkan pasca fee.";
  if (isInvertedRrr) {
    verdictMessage = `PERINGATAN FATAL: Komisi BEI 0.40% membalik RRR menjadi 1 : ${(1 / (effectiveNetRrr || 0.5)).toFixed(1)} (Inverted RRR). Anda butuh Win Rate minimal ${breakEvenWinRatePct}% hanya untuk balik modal!`;
  }

  return {
    targetTickGain: safeGainTicks,
    stopTickLoss: safeLossTicks,
    grossGainPct: Number(grossGainPct.toFixed(2)),
    grossLossPct: Number(grossLossPct.toFixed(2)),
    netGainPct: Number(netGainPct.toFixed(2)),
    netLossPct: Number(netLossPct.toFixed(2)),
    theoreticalRrr,
    effectiveNetRrr,
    breakEvenWinRatePct,
    isInvertedRrr,
    verdictMessage,
  };
}

// 2. Deep Value / Graham Net-Net NCAV Calculator
export interface GrahamNetNetResult {
  ncavTotal: number;
  ncavPerShare: number;
  twoThirdsNcav: number;
  marginOfSafetyPct: number;
  isDeepValue: boolean;
  verdictMessage: string;
}

export function calculateGrahamNetNet(
  currentAssets: number,
  totalLiabilities: number,
  sharesOutstanding: number,
  marketPrice: number
): GrahamNetNetResult {
  if (sharesOutstanding <= 0 || marketPrice <= 0) {
    return {
      ncavTotal: 0,
      ncavPerShare: 0,
      twoThirdsNcav: 0,
      marginOfSafetyPct: 0,
      isDeepValue: false,
      verdictMessage: "Masukkan data aset lancar, liabilitas, jumlah lembar saham, dan harga pasar yang valid.",
    };
  }

  const ncavTotal = currentAssets - totalLiabilities;
  const ncavPerShare = ncavTotal / sharesOutstanding;
  const twoThirdsNcav = ncavPerShare * (2 / 3);

  const marginOfSafetyPct =
    ncavPerShare > 0
      ? Number((((ncavPerShare - marketPrice) / ncavPerShare) * 100).toFixed(1))
      : 0;

  const isDeepValue = marketPrice <= twoThirdsNcav && ncavPerShare > 0;

  let verdictMessage = "Harga pasar masih berada di atas batas 2/3 Net-Net NCAV.";
  if (isDeepValue) {
    verdictMessage = "EXCELLENT: Saham memenuhi kriteria Benjamin Graham Net-Net (Harga pasar <= 2/3 NCAV likuid). Margin of safety sangat tebal!";
  } else if (marketPrice <= ncavPerShare) {
    verdictMessage = "DISCOUNTED: Harga di bawah NCAV penuh, namun belum mencapai diskon 2/3 NCAV Graham.";
  }

  return {
    ncavTotal: Math.round(ncavTotal),
    ncavPerShare: Math.round(ncavPerShare),
    twoThirdsNcav: Math.round(twoThirdsNcav),
    marginOfSafetyPct,
    isDeepValue,
    verdictMessage,
  };
}

// 3. GARP Peter Lynch PEG Ratio Calculator
export interface GarpPegResult {
  per: number;
  epsGrowthPct: number;
  pegRatio: number;
  valuationStatus: "UNDERVALUED" | "FAIR" | "OVERVALUED" | "INVALID";
  verdictMessage: string;
}

export function calculateGarpPeg(per: number, epsGrowthPct: number): GarpPegResult {
  if (per <= 0 || epsGrowthPct <= 0) {
    return {
      per,
      epsGrowthPct,
      pegRatio: 0,
      valuationStatus: "INVALID",
      verdictMessage: "PER dan pertumbuhan EPS tahunan harus bernilai positif.",
    };
  }

  const pegRatio = Number((per / epsGrowthPct).toFixed(2));

  let valuationStatus: GarpPegResult["valuationStatus"] = "FAIR";
  let verdictMessage = "";

  if (pegRatio <= 1.0) {
    valuationStatus = "UNDERVALUED";
    verdictMessage = "IDEAL GARP: PEG Ratio <= 1.0 menunjukkan pertumbuhan laba dihargai sangat murah oleh pasar.";
  } else if (pegRatio <= 1.5) {
    valuationStatus = "FAIR";
    verdictMessage = "FAIR VALUE: PEG Ratio antara 1.0 - 1.5 mencerminkan valuasi wajar terhadap laju pertumbuhannya.";
  } else {
    valuationStatus = "OVERVALUED";
    verdictMessage = "OVERVALUED: PEG Ratio > 1.5. Pasar mematok ekspektasi terlalu tinggi terhadap pertumbuhan saat ini.";
  }

  return {
    per,
    epsGrowthPct,
    pegRatio,
    valuationStatus,
    verdictMessage,
  };
}

// 4. Bandarmologi BEI Concentration Ratio (CR3 / CR5) Calculator
export interface BandarmologiResult {
  totalBuyLots: number;
  cr3Pct: number;
  cr5Pct: number;
  bandarVwap: number;
  flowSignal: "BIG_ACCUMULATION" | "NORMAL_ACCUMULATION" | "NEUTRAL" | "BIG_DISTRIBUTION";
  verdictMessage: string;
}

const FOREIGN_INSTITUTION_BROKERS = new Set(["AK", "BK", "CS", "KZ", "RX", "ZP", "CG", "CC", "NI", "LG", "OD"]);
const PURE_RETAIL_BROKERS = new Set(["YP", "PD", "XC", "XL", "NI"]);

export function calculateBandarmologiConcentration(
  topBuyerLots: number[],
  topSellerLots: number[],
  topBuyerPrices: number[] = [],
  buyerBrokerCodes: string[] = [],
  sellerBrokerCodes: string[] = []
): BandarmologiResult {
  const totalBuyLots = topBuyerLots.reduce((acc, val) => acc + Math.max(0, val), 0);
  const totalSellLots = topSellerLots.reduce((acc, val) => acc + Math.max(0, val), 0);

  if (totalBuyLots <= 0) {
    return {
      totalBuyLots: 0,
      cr3Pct: 0,
      cr5Pct: 0,
      bandarVwap: 0,
      flowSignal: "NEUTRAL",
      verdictMessage: "Masukkan data lot broker pembeli dan penjual.",
    };
  }

  const sortedBuy = [...topBuyerLots].sort((a, b) => b - a);
  const sumTop3 = sortedBuy.slice(0, 3).reduce((acc, v) => acc + v, 0);
  const sumTop5 = sortedBuy.slice(0, 5).reduce((acc, v) => acc + v, 0);

  const cr3Pct = Number(((sumTop3 / totalBuyLots) * 100).toFixed(1));
  const cr5Pct = Number(((sumTop5 / totalBuyLots) * 100).toFixed(1));

  // Calculate Bandar VWAP if prices provided
  let bandarVwap = 0;
  if (topBuyerPrices.length > 0 && topBuyerLots.length === topBuyerPrices.length) {
    let totalNominal = 0;
    for (let i = 0; i < topBuyerLots.length; i++) {
      totalNominal += topBuyerLots[i] * topBuyerPrices[i];
    }
    bandarVwap = totalBuyLots > 0 ? Math.round(totalNominal / totalBuyLots) : 0;
  }

  const institutionalBuyerCount = buyerBrokerCodes.filter((c) =>
    FOREIGN_INSTITUTION_BROKERS.has(c.toUpperCase().trim())
  ).length;
  const institutionalSellerCount = sellerBrokerCodes.filter((c) =>
    FOREIGN_INSTITUTION_BROKERS.has(c.toUpperCase().trim())
  ).length;
  const retailSellerCount = sellerBrokerCodes.filter((c) =>
    PURE_RETAIL_BROKERS.has(c.toUpperCase().trim())
  ).length;
  const retailBuyerCount = buyerBrokerCodes.filter((c) =>
    PURE_RETAIL_BROKERS.has(c.toUpperCase().trim())
  ).length;

  let flowSignal: BandarmologiResult["flowSignal"] = "NEUTRAL";
  let verdictMessage = "Konsentrasi broker berimbang, belum terlihat akumulasi agresif.";

  if (
    retailBuyerCount >= 3 ||
    (retailBuyerCount >= 2 && institutionalSellerCount >= 2)
  ) {
    flowSignal = "BIG_DISTRIBUTION";
    verdictMessage = `BIG DISTRIBUTION (BAHAYA): Pembeli didominasi broker ritel murni (YP, PD, XC) dan penjual didominasi institusi/asing. Waspada ritel dijadikan exit liquidity!`;
  } else if (
    (cr3Pct >= 65 || institutionalBuyerCount >= 2) &&
    (retailSellerCount >= 2 || totalBuyLots > totalSellLots * 1.3)
  ) {
    flowSignal = "BIG_ACCUMULATION";
    verdictMessage = `BIG ACCUMULATION: Top 3 broker menguasai ${cr3Pct}% volume beli didominasi institusi/asing, sedangkan ritel melepas posisi. Sinyal sangat bullish!`;
  } else if (cr3Pct >= 50 || totalBuyLots > totalSellLots) {
    flowSignal = "NORMAL_ACCUMULATION";
    verdictMessage = `NORMAL ACCUMULATION: Konsentrasi CR3 ${cr3Pct}%. Smart money mengumpulkan barang secara moderat.`;
  } else if (cr3Pct < 35) {
    flowSignal = "BIG_DISTRIBUTION";
    verdictMessage = `BIG DISTRIBUTION: Konsentrasi beli menyebar sangat rendah (CR3 ${cr3Pct}%). Tidak ada institusi yang menampung.`;
  }

  return {
    totalBuyLots,
    cr3Pct,
    cr5Pct,
    bandarVwap,
    flowSignal,
    verdictMessage,
  };
}

// 5. Minervini VCP Breakout Calculator
export interface MinerviniVcpResult {
  contractions: number[];
  isProgressivelyTighter: boolean;
  volumeSurgeRatio: number;
  isVolumeValid: boolean;
  isSetupValid: boolean;
  verdictMessage: string;
}

export function calculateMinerviniVcp(
  contractions: number[],
  breakoutVolume: number,
  avg20DayVolume: number
): MinerviniVcpResult {
  if (contractions.length < 2 || avg20DayVolume <= 0) {
    return {
      contractions,
      isProgressivelyTighter: false,
      volumeSurgeRatio: 0,
      isVolumeValid: false,
      isSetupValid: false,
      verdictMessage: "Masukkan minimal 2 tahap kontraksi dan volume rata-rata 20 hari.",
    };
  }

  // Check if each contraction is strictly smaller in magnitude than the previous
  let isProgressivelyTighter = true;
  for (let i = 1; i < contractions.length; i++) {
    if (Math.abs(contractions[i]) >= Math.abs(contractions[i - 1])) {
      isProgressivelyTighter = false;
      break;
    }
  }

  const volumeSurgeRatio = Number(((breakoutVolume / avg20DayVolume) * 100).toFixed(0));
  const isVolumeValid = volumeSurgeRatio >= 150;
  const isSetupValid = isProgressivelyTighter && isVolumeValid;

  let verdictMessage = "";
  if (isSetupValid) {
    verdictMessage = `SETUP VCP SEMPURNA: Kontraksi menyempit (${contractions.map((c) => Math.abs(c) + "%").join(" -> ")}) dan volume breakout melonjak ${volumeSurgeRatio}% (>150% SMA20). Sinyal HAKA terkonfirmasi!`;
  } else if (!isProgressivelyTighter) {
    verdictMessage = "GAGAL VCP: Kontraksi volatilitas tidak menyempit secara bertahap. Pola belum matang.";
  } else {
    verdictMessage = `VOLUME LEMAH: Kontraksi menyempit, namun volume breakout baru ${volumeSurgeRatio}% (di bawah batas minimum 150%). Waspada false breakout!`;
  }

  return {
    contractions,
    isProgressivelyTighter,
    volumeSurgeRatio,
    isVolumeValid,
    isSetupValid,
    verdictMessage,
  };
}

// 6. Dividend Hunter & Ex-Date Trap Buffer
export interface DividendTrapResult {
  dividendYieldPct: number;
  fcfCoverageRatio: number;
  trapRisk: "LOW" | "MODERATE" | "HIGH_DANGER";
  recommendedBufferPct: number;
  verdictMessage: string;
}

export function calculateDividendYieldAndTrap(
  dividendPerShare: number,
  stockPrice: number,
  fcfCoverageRatio: number = 1.3
): DividendTrapResult {
  if (stockPrice <= 0 || dividendPerShare <= 0) {
    return {
      dividendYieldPct: 0,
      fcfCoverageRatio: 0,
      trapRisk: "LOW",
      recommendedBufferPct: 0,
      verdictMessage: "Masukkan nilai DPS dan harga saham yang valid.",
    };
  }

  const dividendYieldPct = Number(((dividendPerShare / stockPrice) * 100).toFixed(2));
  const recommendedBufferPct = Number((dividendYieldPct * 0.75).toFixed(1));

  let trapRisk: DividendTrapResult["trapRisk"] = "LOW";
  let verdictMessage = "";

  if (dividendYieldPct > 12 && fcfCoverageRatio < 1.0) {
    trapRisk = "HIGH_DANGER";
    verdictMessage = `BAHAYA DIVIDEND TRAP: Yield tinggi (${dividendYieldPct}%) namun FCF coverage < 1.0x (laba tidak ditopang arus kas). Koreksi pagi Ex-Date berisiko melampaui dividen yang didapat!`;
  } else if (dividendYieldPct >= 7) {
    trapRisk = "MODERATE";
    verdictMessage = `DIVIDEN JUMBO: Yield sebesar ${dividendYieldPct}%. Amankan posisi sebelum Cum-Date dan pasang buffer Stop Loss ${recommendedBufferPct}%.`;
  } else {
    trapRisk = "LOW";
    verdictMessage = `DIVIDEN STABIL: Yield ${dividendYieldPct}% dengan risiko trap rendah. Cocok untuk strategi compounding jangka panjang.`;
  }

  return {
    dividendYieldPct,
    fcfCoverageRatio,
    trapRisk,
    recommendedBufferPct,
    verdictMessage,
  };
}

// 7. Bramantyo 1% Account Risk & ADV Liquidity Position Sizing
export interface PositionRiskResult {
  maxRiskAmountIdr: number;
  priceRiskDistance: number;
  priceRiskDistancePct: number;
  maxShares: number;
  maxLots: number;
  transactionValueIdr: number;
  positionPercentOfCapital: number;
  advShares: number;
  positionAdvPct: number;
  advLiquidityWarning: boolean;
  advCriticalDanger: boolean;
  verdictMessage: string;
}

export function calculateBramantyoPositionRisk(
  capitalIdr: number,
  entryPrice: number,
  stopLossPrice: number,
  advShares: number = 0,
  riskTolerancePct: number = 1.0
): PositionRiskResult {
  if (capitalIdr <= 0 || entryPrice <= 0 || stopLossPrice <= 0) {
    return {
      maxRiskAmountIdr: 0,
      priceRiskDistance: 0,
      priceRiskDistancePct: 0,
      maxShares: 0,
      maxLots: 0,
      transactionValueIdr: 0,
      positionPercentOfCapital: 0,
      advShares: 0,
      positionAdvPct: 0,
      advLiquidityWarning: false,
      advCriticalDanger: false,
      verdictMessage: "Masukkan modal, harga entry, dan stop loss yang valid.",
    };
  }

  const maxRiskAmountIdr = Math.round(capitalIdr * (riskTolerancePct / 100));
  const priceRiskDistance = Math.abs(entryPrice - stopLossPrice);
  const priceRiskDistancePct = Number(((priceRiskDistance / entryPrice) * 100).toFixed(2));

  let maxShares = 0;
  if (priceRiskDistance > 0) {
    maxShares = Math.floor(maxRiskAmountIdr / priceRiskDistance);
  }

  const maxLots = Math.floor(maxShares / 100);
  const actualShares = maxLots * 100;
  const transactionValueIdr = actualShares * entryPrice;
  const positionPercentOfCapital = Number(((transactionValueIdr / capitalIdr) * 100).toFixed(1));

  let positionAdvPct = 0;
  let advLiquidityWarning = false;
  let advCriticalDanger = false;

  if (advShares > 0) {
    positionAdvPct = Number(((actualShares / advShares) * 100).toFixed(2));
    if (positionAdvPct > 10) {
      advCriticalDanger = true;
    } else if (positionAdvPct > 5) {
      advLiquidityWarning = true;
    }
  }

  let verdictMessage = `Proteksi 1% Modal Aktif: Maksimal ${maxLots} lot (Nilai: Rp ${transactionValueIdr.toLocaleString("id-ID")}). Jika kena SL di Rp ${stopLossPrice.toLocaleString("id-ID")}, kerugian tepat Rp ${(actualShares * priceRiskDistance).toLocaleString("id-ID")} (<= ${riskTolerancePct}% modal).`;

  if (advCriticalDanger) {
    verdictMessage += ` PERINGATAN KRITIS: Ukuran order Anda mencapai ${positionAdvPct}% dari ADV saham ini. Jika terjadi kepanikan, posisi Anda berisiko terkunci ARB tanpa bisa keluar! Pangkas lot.`;
  } else if (advLiquidityWarning) {
    verdictMessage += ` CATATAN: Ukuran order ${positionAdvPct}% ADV. Perhatikan likuiditas saat eksekusi.`;
  }

  return {
    maxRiskAmountIdr,
    priceRiskDistance,
    priceRiskDistancePct,
    maxShares: actualShares,
    maxLots,
    transactionValueIdr,
    positionPercentOfCapital,
    advShares,
    positionAdvPct,
    advLiquidityWarning,
    advCriticalDanger,
    verdictMessage,
  };
}

// 8. Pre-Flight Trade Validator Audit Engine
export interface TradeAuditParams {
  personaId: string;
  ticker: string;
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  capitalIdr: number;
  advShares?: number;
}

export interface TradeAuditFinding {
  title: string;
  status: "PASS" | "WARN" | "FAIL";
  message: string;
}

export interface TradeAuditResult {
  persona: TraderPersona;
  ticker: string;
  verdict: "APPROVED" | "WARNING" | "REJECTED";
  score: number; // 0 - 100
  rrrActual: number;
  rrrRequired: number;
  slDistancePct: number;
  maxSlAllowedPct: number;
  positionSizing: PositionRiskResult;
  findings: TradeAuditFinding[];
  recommendedAction: string;
  goldenDoctrineNumber: number;
  goldenDoctrineQuote: string;
}

export function auditTradeSetup(params: TradeAuditParams): TradeAuditResult {
  const persona =
    TRADER_PERSONAS.find((p) => p.id === params.personaId) || TRADER_PERSONAS[10]; // default Swing Trader

  const { entryPrice, stopLossPrice, targetPrice, capitalIdr, advShares = 0 } = params;

  const findings: TradeAuditFinding[] = [];
  let score = 100;

  // 1. Basic validation
  if (entryPrice <= 0 || stopLossPrice <= 0 || targetPrice <= 0 || capitalIdr <= 0) {
    return {
      persona,
      ticker: params.ticker || "EMITEN",
      verdict: "REJECTED",
      score: 0,
      rrrActual: 0,
      rrrRequired: persona.minRrrTarget,
      slDistancePct: 0,
      maxSlAllowedPct: persona.maxStopLossPct,
      positionSizing: calculateBramantyoPositionRisk(0, 0, 0),
      findings: [
        {
          title: "Input Tidak Lengkap",
          status: "FAIL",
          message: "Harga entry, stop loss, target profit, dan modal harus bernilai positif.",
        },
      ],
      recommendedAction: "Lengkapi data transaksi secara akurat sebelum melakukan audit.",
      goldenDoctrineNumber: 2,
      goldenDoctrineQuote: GOLDEN_DOCTRINES[1].description,
    };
  }

  // Direction: Long Long-bias for IDX
  if (stopLossPrice >= entryPrice) {
    return {
      persona,
      ticker: params.ticker || "EMITEN",
      verdict: "REJECTED",
      score: 0,
      rrrActual: 0,
      rrrRequired: persona.minRrrTarget,
      slDistancePct: 0,
      maxSlAllowedPct: persona.maxStopLossPct,
      positionSizing: calculateBramantyoPositionRisk(capitalIdr, entryPrice, stopLossPrice),
      findings: [
        {
          title: "Stop Loss Tidak Logis",
          status: "FAIL",
          message: "Untuk posisi beli (Long) di BEI, harga Stop Loss harus berada di bawah harga Entry.",
        },
      ],
      recommendedAction: "Ubah level Stop Loss di bawah harga entry.",
      goldenDoctrineNumber: 3,
      goldenDoctrineQuote: GOLDEN_DOCTRINES[2].description,
    };
  }

  const riskDistance = entryPrice - stopLossPrice;
  const rewardDistance = targetPrice - entryPrice;

  const slDistancePct = Number(((riskDistance / entryPrice) * 100).toFixed(2));
  const rrrActual = Number((rewardDistance / riskDistance).toFixed(2));

  // 2. Audit Risk-to-Reward Ratio vs Persona Threshold
  if (rrrActual >= persona.minRrrTarget) {
    findings.push({
      title: `Risk-to-Reward Ratio (${rrrActual} : 1)`,
      status: "PASS",
      message: `Memenuhi kriteria minimum persona ${persona.name} (${persona.minRrrLabel}). Rasio asimetris yang sehat!`,
    });
  } else if (rrrActual >= 1.2) {
    score -= 25;
    findings.push({
      title: `Risk-to-Reward Ratio (${rrrActual} : 1)`,
      status: "WARN",
      message: `Di bawah target ideal ${persona.name} (${persona.minRrrLabel}), namun masih berada di atas batas minimal impas 1:1.2.`,
    });
  } else {
    score -= 50;
    findings.push({
      title: `Risk-to-Reward Ratio (${rrrActual} : 1)`,
      status: "FAIL",
      message: `REJECT: RRR terlalu sempit (${rrrActual} : 1). Anda mempertaruhkan risiko yang tidak sebanding dengan potensi cuan.`,
    });
  }

  // 3. Audit Stop Loss Distance vs Persona Max Tolerance
  if (slDistancePct <= persona.maxStopLossPct) {
    findings.push({
      title: `Jarak Stop Loss (${slDistancePct}%)`,
      status: "PASS",
      message: `Berada dalam koridor toleransi aman persona ${persona.name} (Maks ${persona.maxStopLossLabel}).`,
    });
  } else if (slDistancePct <= persona.maxStopLossPct * 1.3) {
    score -= 20;
    findings.push({
      title: `Jarak Stop Loss (${slDistancePct}%)`,
      status: "WARN",
      message: `Melebihi toleransi standar ${persona.name} (${persona.maxStopLossLabel}). Pertimbangkan mempersempit titik entry atau mencari support terdekat.`,
    });
  } else {
    score -= 40;
    findings.push({
      title: `Jarak Stop Loss (${slDistancePct}%)`,
      status: "FAIL",
      message: `REJECT: Stop Loss terlalu lebar (${slDistancePct}% vs batas ${persona.maxStopLossLabel}). Risiko drawdown terlalu curam!`,
    });
  }

  // 4. Position Sizing & Liquidity Audit
  const positionSizing = calculateBramantyoPositionRisk(capitalIdr, entryPrice, stopLossPrice, advShares);

  if (positionSizing.advCriticalDanger) {
    score -= 40;
    findings.push({
      title: "Risiko Likuiditas ADV Kritis",
      status: "FAIL",
      message: `Ukuran lot (${positionSizing.maxLots} lot) melampaui 10% volume harian emiten (${positionSizing.positionAdvPct}% ADV). Berisiko terjebak kunci ARB!`,
    });
  } else if (positionSizing.advLiquidityWarning) {
    score -= 15;
    findings.push({
      title: "Peringatan Likuiditas ADV",
      status: "WARN",
      message: `Ukuran posisi mencapai ${positionSizing.positionAdvPct}% dari volume harian. Bagilah order secara bertahap saat eksekusi.`,
    });
  } else {
    findings.push({
      title: "Position Sizing 1% Modal",
      status: "PASS",
      message: `Alokasi maksimal ${positionSizing.maxLots} lot. Risiko moneter terproteksi ketat pada Rp ${positionSizing.maxRiskAmountIdr.toLocaleString("id-ID")}.`,
    });
  }

  // Final Verdict Decision
  score = Math.max(0, Math.min(100, score));

  let verdict: TradeAuditResult["verdict"] = "APPROVED";
  let recommendedAction = "";
  let goldenDoctrineNumber = 6;

  if (score >= 75 && !findings.some((f) => f.status === "FAIL")) {
    verdict = "APPROVED";
    recommendedAction = `EKSEKUSI RENCANA: Setup memenuhi standar disiplin ${persona.name}. Pasang order beli dan langsung pasang Auto-Order Stop Loss GTC di Rp ${stopLossPrice.toLocaleString("id-ID")}.`;
    goldenDoctrineNumber = 10;
  } else if (score >= 50 && !findings.some((f) => f.title.includes("Stop Loss Tidak Logis"))) {
    verdict = "WARNING";
    recommendedAction = `EVALUASI KEMBALI: Terdapat parameter yang belum optimal. Pertimbangkan menaikkan target Take Profit atau menunggu retracement harga lebih dekat ke support untuk memperkecil risiko.`;
    goldenDoctrineNumber = 3;
  } else {
    verdict = "REJECTED";
    recommendedAction = `TOLAK TRANSAKSI: Setup melanggar prinsip tata kelola risiko modal portofolio. Cari setup lain yang menawarkan rasio risk-to-reward lebih superior.`;
    goldenDoctrineNumber = 2;
  }

  const goldenDoctrineQuote =
    GOLDEN_DOCTRINES.find((d) => d.number === goldenDoctrineNumber)?.description ||
    GOLDEN_DOCTRINES[1].description;

  return {
    persona,
    ticker: params.ticker ? params.ticker.toUpperCase() : "EMITEN",
    verdict,
    score,
    rrrActual,
    rrrRequired: persona.minRrrTarget,
    slDistancePct,
    maxSlAllowedPct: persona.maxStopLossPct,
    positionSizing,
    findings,
    recommendedAction,
    goldenDoctrineNumber,
    goldenDoctrineQuote,
  };
}

// 9. Interactive DNA Matcher Logic (Section 8 Diagnostic)
export interface DnaAnswerParams {
  screenTime: "full_time" | "part_time" | "night_only";
  capitalScale: "under_25m" | "range_25_100m" | "range_100_500m" | "over_500m";
  riskFocus: "fast_adrenaline" | "analytical_precision" | "flow_momentum" | "value_dividend";
}

export interface DnaDiagnosticResult {
  primaryPersona: TraderPersona;
  secondaryPersona: TraderPersona;
  rationale: string;
  richardRuleTitle: string;
  richardRuleDescription: string;
}

export function diagnoseTraderDna(answers: DnaAnswerParams): DnaDiagnosticResult {
  const getPersona = (id: string) => TRADER_PERSONAS.find((p) => p.id === id) || TRADER_PERSONAS[10];

  // Screen Time is King (Diagnostic Rule #1)
  if (answers.screenTime === "night_only") {
    // Malam hari saja: DILARANG Scalper / Day Trader!
    if (answers.capitalScale === "under_25m") {
      return {
        primaryPersona: getPersona("breakout-vcp"),
        secondaryPersona: getPersona("swing-trader"),
        rationale: "Screen time malam hari & modal di bawah Rp 25 Juta: Fokuskan modal pada 2-3 ide terbaik menggunakan metode Breakout VCP atau Swing Trading untuk akselerasi modal.",
        richardRuleTitle: "Doktrin Diagnostik #1 (Karyawan) & #2 (Modal < 25 Jt)",
        richardRuleDescription: "DILARANG scalping. Fokus pada 2-3 saham berkekuatan momentum tinggi dengan auto-order stop loss.",
      };
    } else if (answers.capitalScale === "over_500m") {
      return {
        primaryPersona: getPersona("sector-rotation"),
        secondaryPersona: getPersona("dividend-hunter"),
        rationale: "Screen time malam hari & modal institusional (> Rp 500 Jt): Gaya Sector Rotation dan Dividend Investing pada emiten blue chip likuid adalah pilihan paling tenang dan menguntungkan.",
        richardRuleTitle: "Doktrin Diagnostik #3 (Modal > 1 Miliar / Skala Besar)",
        richardRuleDescription: "Hindari saham gorengan lapis tiga. Alokasikan ke sektor pemenang siklus bisnis dengan likuiditas tinggi.",
      };
    } else {
      // 25 - 500m
      if (answers.riskFocus === "value_dividend") {
        return {
          primaryPersona: getPersona("garp"),
          secondaryPersona: getPersona("deep-value"),
          rationale: "Screen time malam hari dengan fokus nilai wajar: Gaya GARP Peter Lynch dan Deep Value Graham memberi ketenangan pikiran dan pertumbuhan terukur.",
          richardRuleTitle: "Doktrin Diagnostik #1 (Analisis EOD Tenang)",
          richardRuleDescription: "Kuasai fundamental bisnis di luar jam bursa, biarkan compounding bekerja.",
        };
      }
      return {
        primaryPersona: getPersona("swing-trader"),
        secondaryPersona: getPersona("trend-follower"),
        rationale: "Screen time malam hari: Gaya Swing Trader EOD adalah rasio Return-to-Effort tertinggi bagi profesional yang sibuk bekerja di siang hari.",
        richardRuleTitle: "Doktrin Diagnostik #1 (Pilihan Emas Profesional)",
        richardRuleDescription: "Analisis grafik santai di malam hari, pasang GTC Auto-Order Stop Loss, tidur nyenyak.",
      };
    }
  }

  if (answers.screenTime === "full_time") {
    if (answers.riskFocus === "fast_adrenaline") {
      return {
        primaryPersona: getPersona("scalper"),
        secondaryPersona: getPersona("tape-reader"),
        rationale: "Screen time penuh & menyukai aksi cepat: Anda memiliki kapasitas memantau Level 2 DOM dan time & sales untuk scalping. Waspadai beban komisi transaksi bursa!",
        richardRuleTitle: "Peringatan Waspada Friksi Fee Scalper",
        richardRuleDescription: "Wajib jaga Win Rate di atas 66.7% karena komisi round-trip BEI 0.40% membalik rasio RRR Anda.",
      };
    }
    if (answers.riskFocus === "flow_momentum") {
      return {
        primaryPersona: getPersona("bandarmologi"),
        secondaryPersona: getPersona("day-trader"),
        rationale: "Screen time penuh & fokus aliran dana: Bandarmologi dan Day Trading intraday di sesi 1 dan 2 memungkinkan Anda menunggangi akumulasi smart money.",
        richardRuleTitle: "Doktrin #5: Jangan Menghadang Paus",
        richardRuleDescription: "Berenanglah searah broker institusi (AK, BK, KZ) dan hindari saham yang sedang diborong ritel.",
      };
    }
    return {
      primaryPersona: getPersona("day-trader"),
      secondaryPersona: getPersona("breakout-vcp"),
      rationale: "Screen time penuh: Day trading berbasis ORB dan VWAP pullback memberi keuntungan tanpa overnight risk.",
      richardRuleTitle: "Patuhi Personal Circuit Breaker",
      richardRuleDescription: "Batasi maksimal 3 transaksi per hari untuk mencegah decision fatigue dan overtrading.",
    };
  }

  // Part-time (1-2 Jam Sehari)
  if (answers.riskFocus === "flow_momentum") {
    return {
      primaryPersona: getPersona("foreign-flow"),
      secondaryPersona: getPersona("bandarmologi"),
      rationale: "Waktu 1-2 jam sehari: Pantau akumulasi Foreign Net Buy harian dan Broker Summary EOD untuk memetik swing multi-minggu.",
      richardRuleTitle: "Ikuti Jejak Smart Money",
      richardRuleDescription: "Institusi asing menggerakkan arah tren saham LQ45 secara berkesinambungan.",
    };
  }

  return {
    primaryPersona: getPersona("swing-trader"),
    secondaryPersona: getPersona("growth-canslim"),
    rationale: "Waktu 1-2 jam per hari: Swing Trading dan Growth CANSLIM memberi ruang analisis yang cukup untuk menangkap impulse leg mingguan.",
    richardRuleTitle: "Patuhi Stop Loss Tanpa Kompromi",
    richardRuleDescription: "Tetapkan titik keluar teknikal sebelum menekan tombol beli.",
  };
}
