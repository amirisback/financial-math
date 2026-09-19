import { describe, it, expect } from "vitest";
import {
  calculateScaleOutTP,
  calculateAtrVolatilityStop,
  calculateKellyCriterion,
  calculateTradeExpectancy,
  calculateRiskOfRuin,
  calculateCompoundingGrowth,
} from "../trader-math";

describe("trader-math library", () => {
  describe("calculateScaleOutTP", () => {
    it("calculates partial scale-out for LONG positions correctly", () => {
      // Entry 1000, SL 900 -> Risk per unit = 100
      // 100 lots of 100 shares -> 100 units
      const result = calculateScaleOutTP(1000, 900, 100, "LONG", [
        { percentOfPosition: 50, riskRewardRatio: 1.5 },
        { percentOfPosition: 30, riskRewardRatio: 2.5 },
        { percentOfPosition: 20, riskRewardRatio: 4.0 },
      ], 100);

      expect(result.riskPerUnit).toBe(100);
      expect(result.totalRiskAmount).toBe(100 * 100 * 100); // 1,000,000 IDR
      expect(result.tiers.length).toBe(3);

      // Tier 1: 50 lots at 1000 + 150 = 1150
      expect(result.tiers[0].lots).toBe(50);
      expect(result.tiers[0].targetPrice).toBe(1150);

      // Tier 2: 30 lots at 1000 + 250 = 1250
      expect(result.tiers[1].lots).toBe(30);
      expect(result.tiers[1].targetPrice).toBe(1250);

      // Tier 3: 20 lots at 1000 + 400 = 1400
      expect(result.tiers[2].lots).toBe(20);
      expect(result.tiers[2].targetPrice).toBe(1400);

      expect(result.totalExpectedProfit).toBeGreaterThan(0);
      expect(result.blendedRiskReward).toBeGreaterThan(1.5);
      expect(result.bepAdvice).toContain("segera geser Stop Loss");
    });

    it("handles SHORT positions correctly", () => {
      // Short entry 100, SL 110 -> Risk = 10
      const result = calculateScaleOutTP(100, 110, 10, "SHORT", [
        { percentOfPosition: 50, riskRewardRatio: 2.0 },
        { percentOfPosition: 50, riskRewardRatio: 3.0 },
      ], 1);

      expect(result.riskPerUnit).toBe(10);
      expect(result.tiers[0].targetPrice).toBe(80); // 100 - (10 * 2) = 80
      expect(result.tiers[1].targetPrice).toBe(70); // 100 - (10 * 3) = 70
    });

    it("safely handles invalid zero/negative inputs without crashing", () => {
      const result = calculateScaleOutTP(0, 0, 0);
      expect(result.totalRiskAmount).toBe(0);
      expect(result.tiers).toEqual([]);
      expect(result.blendedRiskReward).toBe(0);
    });
  });

  describe("calculateAtrVolatilityStop", () => {
    it("calculates ATR stop loss and targets for LONG", () => {
      // Price 5000, ATR 100, multiplier 1.5 -> Distance 150
      const result = calculateAtrVolatilityStop(5000, 100, 1.5, "LONG");
      expect(result.stopLossDistance).toBe(150);
      expect(result.recommendedStopLoss).toBe(4850);
      expect(result.recommendedTp1).toBe(5225); // 5000 + 150 * 1.5
      expect(result.volatilityBufferPercent).toBe(3); // 150 / 5000 * 100
    });

    it("calculates ATR stop loss and targets for SHORT", () => {
      const result = calculateAtrVolatilityStop(100, 2, 2.0, "SHORT");
      expect(result.stopLossDistance).toBe(4);
      expect(result.recommendedStopLoss).toBe(104);
      expect(result.recommendedTp1).toBe(94); // 100 - (4 * 1.5)
    });

    it("handles zero or invalid ATR gracefully", () => {
      const result = calculateAtrVolatilityStop(0, 0, 0);
      expect(result.stopLossDistance).toBe(0);
      expect(result.recommendedStopLoss).toBe(0);
    });
  });

  describe("calculateKellyCriterion", () => {
    it("calculates positive edge Kelly correctly", () => {
      // Win Rate 50%, Avg Win 200, Avg Loss 100 -> R = 2
      // K = 0.5 - (1 - 0.5)/2 = 0.5 - 0.25 = 0.25 (25%)
      const result = calculateKellyCriterion(50, 200, 100);
      expect(result.payoffRatio).toBe(2);
      expect(result.fullKellyPct).toBe(25);
      expect(result.halfKellyPct).toBe(12.5);
      expect(result.status).toBe("safe");
      expect(result.recommendedRiskPct).toBe(2.5); // capped at institutional safety
    });

    it("identifies negative expectancy system (Kelly <= 0)", () => {
      // Win Rate 30%, Avg Win 100, Avg Loss 100 -> R = 1
      // K = 0.3 - 0.7 = -0.4 (< 0)
      const result = calculateKellyCriterion(30, 100, 100);
      expect(result.fullKellyPct).toBe(0);
      expect(result.status).toBe("negative");
      expect(result.message).toContain("ekspektasi negatif");
    });

    it("handles empty or zero values", () => {
      const result = calculateKellyCriterion(0, 0, 0);
      expect(result.status).toBe("negative");
      expect(result.fullKellyPct).toBe(0);
    });
  });

  describe("calculateTradeExpectancy", () => {
    it("computes positive trade expectancy accurately", () => {
      // 60% win rate, win 1,000,000, loss 500,000
      // E = (0.6 * 1,000,000) - (0.4 * 500,000) = 600,000 - 200,000 = 400,000
      const result = calculateTradeExpectancy(60, 1000000, 500000);
      expect(result.expectancyPerTrade).toBe(400000);
      expect(result.status).toBe("positive");
      expect(result.projectedProfit100Trades).toBe(40000000);
    });

    it("computes negative trade expectancy accurately", () => {
      // 40% win rate, win 500,000, loss 1,000,000
      // E = 200,000 - 600,000 = -400,000
      const result = calculateTradeExpectancy(40, 500000, 1000000);
      expect(result.expectancyPerTrade).toBe(-400000);
      expect(result.status).toBe("negative");
    });
  });

  describe("calculateRiskOfRuin", () => {
    it("reports minimal risk for low risk per trade with statistical edge", () => {
      const result = calculateRiskOfRuin(1.0, 55, 1.8);
      expect(result.status).toBe("minimal");
      expect(result.ruinProbabilityPct).toBeLessThan(5);
      expect(result.consecutiveLossesTo20Pct).toBeGreaterThan(20);
    });

    it("triggers critical status when risk per trade is too high", () => {
      const result = calculateRiskOfRuin(10.0, 40, 1.2);
      expect(result.status).toBe("critical");
      expect(result.consecutiveLossesTo20Pct).toBeLessThanOrEqual(3);
    });
  });

  describe("calculateCompoundingGrowth", () => {
    it("calculates compounding progression accurately", () => {
      // 10,000,000 at 5% per month for 12 months
      // A = 10,000,000 * (1.05)^12 ~= 17,958,563
      const result = calculateCompoundingGrowth(10000000, 5, 12, "month");
      expect(result.periods).toBe(12);
      expect(result.milestones.length).toBe(12);
      expect(result.finalBalance).toBeGreaterThan(17000000);
      expect(result.netProfit).toBe(result.finalBalance - 10000000);
      expect(result.totalReturnPct).toBeGreaterThan(70);
    });
  });
});
