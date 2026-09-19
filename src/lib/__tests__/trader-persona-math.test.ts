import { describe, it, expect } from "vitest";
import {
  calculateScalperFrictionRuin,
  calculateGrahamNetNet,
  calculateGarpPeg,
  calculateBandarmologiConcentration,
  calculateMinerviniVcp,
  calculateDividendYieldAndTrap,
  calculateBramantyoPositionRisk,
  auditTradeSetup,
  diagnoseTraderDna,
} from "../trader-persona-math";
import { TRADER_PERSONAS } from "../trader-personas-data";

describe("trader-persona-math library", () => {
  describe("18 Trader Personas Registry Integrity", () => {
    it("contains exactly 18 distinct trader personas", () => {
      expect(TRADER_PERSONAS.length).toBe(18);
      const uniqueIds = new Set(TRADER_PERSONAS.map((p) => p.id));
      expect(uniqueIds.size).toBe(18);
    });

    it("has valid clusters assigned to each persona", () => {
      TRADER_PERSONAS.forEach((persona) => {
        expect(["macro", "fundamental", "technical", "flow"]).toContain(persona.clusterId);
        expect(persona.minRrrTarget).toBeGreaterThan(0);
        expect(persona.maxStopLossPct).toBeGreaterThan(0);
        expect(persona.emitenUniverse.length).toBeGreaterThan(0);
      });
    });
  });

  describe("calculateScalperFrictionRuin", () => {
    it("accurately computes inverted RRR and break-even win rate 66.7% for BEI", () => {
      // 2 tick gain (0.80%), 1 tick loss (0.40%), 0.40% round-trip fee
      const result = calculateScalperFrictionRuin(2, 1, 0.40, 0.40);

      expect(result.grossGainPct).toBe(0.80);
      expect(result.grossLossPct).toBe(0.40);
      expect(result.netGainPct).toBe(0.40);
      expect(result.netLossPct).toBe(0.80);
      expect(result.theoreticalRrr).toBe(2.0);
      expect(result.effectiveNetRrr).toBe(0.5); // Inverted 1 : 2
      expect(result.breakEvenWinRatePct).toBe(66.7);
      expect(result.isInvertedRrr).toBe(true);
      expect(result.verdictMessage).toContain("Inverted RRR");
    });

    it("handles safe fallbacks for zero or negative values", () => {
      const result = calculateScalperFrictionRuin(0, 0);
      expect(result.targetTickGain).toBe(1);
      expect(result.stopTickLoss).toBe(1);
    });
  });

  describe("calculateGrahamNetNet", () => {
    it("identifies true Benjamin Graham Net-Net discount (price <= 2/3 NCAV)", () => {
      // Current assets 100B, Liabilities 40B -> NCAV = 60B.
      // 100M shares -> NCAV/share = 600.
      // 2/3 NCAV = 400. Market price 350.
      const result = calculateGrahamNetNet(100_000_000_000, 40_000_000_000, 100_000_000, 350);

      expect(result.ncavTotal).toBe(60_000_000_000);
      expect(result.ncavPerShare).toBe(600);
      expect(result.twoThirdsNcav).toBe(400);
      expect(result.isDeepValue).toBe(true);
      expect(result.marginOfSafetyPct).toBeGreaterThan(40);
      expect(result.verdictMessage).toContain("EXCELLENT");
    });

    it("handles safe zero fallbacks", () => {
      const result = calculateGrahamNetNet(0, 0, 0, 0);
      expect(result.isDeepValue).toBe(false);
      expect(result.ncavPerShare).toBe(0);
    });
  });

  describe("calculateGarpPeg", () => {
    it("flags undervalued status when PEG <= 1.0", () => {
      // PER 12, EPS Growth 20% -> PEG = 0.60
      const result = calculateGarpPeg(12, 20);
      expect(result.pegRatio).toBe(0.60);
      expect(result.valuationStatus).toBe("UNDERVALUED");
    });

    it("flags overvalued status when PEG > 1.5", () => {
      // PER 30, EPS Growth 15% -> PEG = 2.0
      const result = calculateGarpPeg(30, 15);
      expect(result.pegRatio).toBe(2.0);
      expect(result.valuationStatus).toBe("OVERVALUED");
    });
  });

  describe("calculateBandarmologiConcentration", () => {
    it("detects BIG ACCUMULATION when Top 3 buyers dominate >70% with foreign brokers", () => {
      const buyLots = [50000, 30000, 20000, 5000, 5000]; // sum = 110,000. Top 3 = 100,000 (90.9%)
      const sellLots = [10000, 10000, 10000, 10000, 10000];
      const buyerBrokers = ["AK", "BK", "KZ"];
      const sellerBrokers = ["YP", "PD", "XC"];

      const result = calculateBandarmologiConcentration(buyLots, sellLots, [1000, 1000, 1000, 1000, 1000], buyerBrokers, sellerBrokers);
      expect(result.cr3Pct).toBeGreaterThan(70);
      expect(result.flowSignal).toBe("BIG_ACCUMULATION");
      expect(result.verdictMessage).toContain("BIG ACCUMULATION");
    });

    it("detects BIG DISTRIBUTION when buyers are dominated by retail brokers", () => {
      const buyLots = [10000, 10000, 10000, 10000, 10000];
      const sellLots = [50000, 40000, 30000, 10000, 10000];
      const buyerBrokers = ["YP", "PD", "XC", "XL"];
      const sellerBrokers = ["AK", "BK", "RX"];

      const result = calculateBandarmologiConcentration(buyLots, sellLots, [], buyerBrokers, sellerBrokers);
      expect(result.flowSignal).toBe("BIG_DISTRIBUTION");
    });
  });

  describe("calculateMinerviniVcp", () => {
    it("confirms valid VCP setup with tightening contractions and volume surge >= 150%", () => {
      // Contractions -15%, -8%, -3%
      const result = calculateMinerviniVcp([-15, -8, -3], 3_000_000, 1_500_000);
      expect(result.isProgressivelyTighter).toBe(true);
      expect(result.volumeSurgeRatio).toBe(200);
      expect(result.isVolumeValid).toBe(true);
      expect(result.isSetupValid).toBe(true);
      expect(result.verdictMessage).toContain("SETUP VCP SEMPURNA");
    });

    it("fails when volume surge is below 150%", () => {
      const result = calculateMinerviniVcp([-15, -8, -3], 1_200_000, 1_000_000);
      expect(result.volumeSurgeRatio).toBe(120);
      expect(result.isSetupValid).toBe(false);
      expect(result.verdictMessage).toContain("VOLUME LEMAH");
    });
  });

  describe("calculateDividendYieldAndTrap", () => {
    it("flags high danger dividend trap when yield is high but FCF coverage < 1.0", () => {
      const result = calculateDividendYieldAndTrap(400, 2500, 0.7); // 16% yield, 0.7 FCF coverage
      expect(result.dividendYieldPct).toBe(16.0);
      expect(result.trapRisk).toBe("HIGH_DANGER");
      expect(result.verdictMessage).toContain("BAHAYA DIVIDEND TRAP");
    });
  });

  describe("calculateBramantyoPositionRisk", () => {
    it("strictly limits loss to 1% of capital on PTBA scenario from guide", () => {
      // Total capital: 100,000,000 IDR
      // Entry: 2600, SL: 2470 (delta = 130)
      // Risk 1% = 1,000,000 IDR
      // Max shares = 1,000,000 / 130 = 7,692 -> 76 lots (7,600 shares)
      const result = calculateBramantyoPositionRisk(100_000_000, 2600, 2470, 500_000);

      expect(result.maxRiskAmountIdr).toBe(1_000_000);
      expect(result.priceRiskDistance).toBe(130);
      expect(result.maxLots).toBe(76);
      expect(result.transactionValueIdr).toBe(76 * 100 * 2600); // 19,760,000
      expect(result.advLiquidityWarning).toBe(false);
      expect(result.advCriticalDanger).toBe(false);
    });

    it("triggers critical ADV liquidity alert when order exceeds 10% ADV", () => {
      // Capital 500,000,000, Entry 500, SL 480 (delta 20)
      // Risk = 5,000,000. Shares = 250,000.
      // If ADV is only 1,000,000 shares -> order is 25% of ADV (> 10%)
      const result = calculateBramantyoPositionRisk(500_000_000, 500, 480, 1_000_000);
      expect(result.advCriticalDanger).toBe(true);
      expect(result.verdictMessage).toContain("PERINGATAN KRITIS");
    });
  });

  describe("auditTradeSetup", () => {
    it("approves valid PTBA swing setup meeting 1:2.3 RRR and 5% SL", () => {
      const result = auditTradeSetup({
        personaId: "swing-trader",
        ticker: "PTBA",
        entryPrice: 2600,
        stopLossPrice: 2470,
        targetPrice: 2900, // Reward: 300, Risk: 130 -> RRR: 2.31
        capitalIdr: 100_000_000,
        advShares: 10_000_000,
      });

      expect(result.verdict).toBe("APPROVED");
      expect(result.score).toBeGreaterThanOrEqual(75);
      expect(result.positionSizing.maxLots).toBe(76);
      expect(result.findings.some((f) => f.status === "PASS")).toBe(true);
      expect(result.recommendedAction).toContain("EKSEKUSI RENCANA");
    });

    it("rejects invalid trade where stop loss is above entry price", () => {
      const result = auditTradeSetup({
        personaId: "swing-trader",
        ticker: "BBCA",
        entryPrice: 10000,
        stopLossPrice: 10500,
        targetPrice: 12000,
        capitalIdr: 50_000_000,
      });

      expect(result.verdict).toBe("REJECTED");
      expect(result.score).toBe(0);
      expect(result.findings[0].title).toBe("Stop Loss Tidak Logis");
    });

    it("rejects trade with poor RRR (< 1:1) and massive stop loss", () => {
      const result = auditTradeSetup({
        personaId: "scalper",
        ticker: "GOTO",
        entryPrice: 50,
        stopLossPrice: 40, // 20% loss vs scalper max 1%
        targetPrice: 52, // 4% gain -> RRR = 0.2
        capitalIdr: 10_000_000,
      });

      expect(result.verdict).toBe("REJECTED");
      expect(result.findings.some((f) => f.status === "FAIL")).toBe(true);
    });
  });

  describe("diagnoseTraderDna", () => {
    it("strictly forbids scalping for night-only screen time according to Richard Doctrine #1", () => {
      const result = diagnoseTraderDna({
        screenTime: "night_only",
        capitalScale: "under_25m",
        riskFocus: "flow_momentum",
      });

      expect(result.primaryPersona.id).not.toBe("scalper");
      expect(result.primaryPersona.id).not.toBe("day-trader");
      expect(["breakout-vcp", "swing-trader"]).toContain(result.primaryPersona.id);
      expect(result.richardRuleDescription).toContain("DILARANG scalping");
    });

    it("recommends Sector Rotation and Dividend for high capital (> 500m) and night screen time", () => {
      const result = diagnoseTraderDna({
        screenTime: "night_only",
        capitalScale: "over_500m",
        riskFocus: "value_dividend",
      });

      expect(result.primaryPersona.id).toBe("sector-rotation");
      expect(result.secondaryPersona.id).toBe("dividend-hunter");
    });

    it("recommends Scalper only for full-time screen time with fast adrenaline focus", () => {
      const result = diagnoseTraderDna({
        screenTime: "full_time",
        capitalScale: "range_25_100m",
        riskFocus: "fast_adrenaline",
      });

      expect(result.primaryPersona.id).toBe("scalper");
      expect(result.richardRuleTitle).toContain("Friksi Fee");
    });
  });
});
