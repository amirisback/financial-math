import { describe, it, expect } from "vitest";
import {
  calculateSahamTrading,
  calculateGrahamValuation,
  calculateAverageDown,
  calculateDividendPlanner,
  calculateEmasInvestment,
  calculateCryptoTrading,
} from "../asset-math";

describe("asset-math library", () => {
  describe("calculateSahamTrading", () => {
    it("should accurately compute gross, fees, PPN, PPh, net profit, and BEP for standard IDX trade", () => {
      const result = calculateSahamTrading({
        buyPrice: 5000,
        sellPrice: 5500,
        lots: 10,
        feeBuyPct: 0.15,
        feeSellPct: 0.25,
      });

      expect(result.sharesCount).toBe(1000);
      expect(result.grossBuy).toBe(5000000);
      expect(result.feeBuyAmount).toBe(7500);
      expect(result.ppnBuyAmount).toBe(825);
      expect(result.totalCostBuy).toBe(5008325);

      expect(result.grossSell).toBe(5500000);
      expect(result.feeSellAmount).toBe(13750);
      expect(result.ppnSellAmount).toBe(1512.5);
      expect(result.pphSellAmount).toBe(5500);
      expect(result.netReceived).toBe(5479237.5);

      expect(result.netProfit).toBeCloseTo(470912.5, 1);
      expect(result.roi).toBeGreaterThan(9);
      expect(result.bepPrice).toBeGreaterThan(5000);
      expect(result.bepPrice).toBeLessThan(5500);
    });

    it("should gracefully handle zero lots or prices without NaN", () => {
      const result = calculateSahamTrading({
        buyPrice: 0,
        sellPrice: 0,
        lots: 0,
        feeBuyPct: 0.15,
        feeSellPct: 0.25,
      });

      expect(result.totalCostBuy).toBe(0);
      expect(result.netReceived).toBe(0);
      expect(result.netProfit).toBe(0);
      expect(result.roi).toBe(0);
      expect(result.bepPrice).toBe(0);
    });
  });

  describe("calculateGrahamValuation", () => {
    it("should compute Graham Number and detect undervalued stock with MoS >= 20%", () => {
      // Graham Number = sqrt(22.5 * 380 * 2600) = sqrt(22230000) = 4714.87 -> 4715
      const result = calculateGrahamValuation({
        currentPrice: 3500,
        eps: 380,
        bvps: 2600,
      });

      expect(result.grahamNumber).toBe(4715);
      expect(result.mosPercent).toBeGreaterThan(20);
      expect(result.status).toBe("undervalued");
      expect(result.impliedPE).toBeCloseTo(3500 / 380, 2);
    });

    it("should detect overvalued stock when price exceeds Graham Number", () => {
      const result = calculateGrahamValuation({
        currentPrice: 5000,
        eps: 300,
        bvps: 2000,
      });
      // Graham = sqrt(22.5 * 300 * 2000) = sqrt(13500000) = 3674
      expect(result.grahamNumber).toBe(3674);
      expect(result.mosPercent).toBeLessThan(0);
      expect(result.status).toBe("overvalued");
    });

    it("should return zeros for negative or zero EPS/BVPS without throwing", () => {
      const result = calculateGrahamValuation({
        currentPrice: 1000,
        eps: -50,
        bvps: 0,
      });
      expect(result.grahamNumber).toBe(0);
      expect(result.status).toBe("overvalued");
    });
  });

  describe("calculateAverageDown", () => {
    it("should calculate new average price and rebound needed accurately", () => {
      const result = calculateAverageDown({
        initialLots: 10,
        initialPrice: 5000,
        newLots: 10,
        newPrice: 4000,
      });

      expect(result.totalLotsAfter).toBe(20);
      expect(result.totalSharesAfter).toBe(2000);
      expect(result.initialCapital).toBe(5000000);
      expect(result.additionalCapital).toBe(4000000);
      expect(result.totalCapitalAfter).toBe(9000000);
      expect(result.newAveragePrice).toBe(4500);
      expect(result.priceReductionPercent).toBe(10);
      expect(result.reboundNeededPercent).toBe(12.5);
    });
  });

  describe("calculateDividendPlanner", () => {
    it("should calculate annual and monthly net dividend with tax exemptions", () => {
      const resultExempt = calculateDividendPlanner({
        stockPrice: 5000,
        dps: 250,
        lots: 50,
        taxOption: "exempt",
        targetMonthly: 5000000,
      });

      expect(resultExempt.totalShares).toBe(5000);
      expect(resultExempt.taxRate).toBe(0);
      expect(resultExempt.netDps).toBe(250);
      expect(resultExempt.annualNet).toBe(1250000);
      expect(resultExempt.monthlyNet).toBeCloseTo(1250000 / 12, 2);
      expect(resultExempt.dividendYieldNet).toBe(5);
      expect(resultExempt.requiredShares).toBe(240000);
      expect(resultExempt.requiredLots).toBe(2400);

      const resultReguler = calculateDividendPlanner({
        stockPrice: 5000,
        dps: 250,
        lots: 50,
        taxOption: "reguler",
        targetMonthly: 5000000,
      });
      expect(resultReguler.taxRate).toBe(0.1);
      expect(resultReguler.netDps).toBe(225);
      expect(resultReguler.annualNet).toBe(1125000);
    });
  });

  describe("calculateEmasInvestment", () => {
    it("should calculate buy tax 0.45% for NPWP and apply sell tax 1.5% only when > 10 million", () => {
      // 10 grams at 1,300,000 buy = 13,000,000 gross buy
      // 10 grams at 1,200,000 sell = 12,000,000 gross sell (> 10 million -> tax applies!)
      const result = calculateEmasInvestment({
        weightGrams: 10,
        priceBuyPerGram: 1300000,
        priceSellPerGram: 1200000,
        npwpStatus: "npwp",
      });

      expect(result.grossBuy).toBe(13000000);
      expect(result.buyTaxRate).toBe(0.0045);
      expect(result.buyTaxAmount).toBe(58500);
      expect(result.totalCostBuy).toBe(13058500);

      expect(result.grossSell).toBe(12000000);
      expect(result.sellTaxRate).toBe(0.015);
      expect(result.sellTaxAmount).toBe(180000);
      expect(result.netReceived).toBe(11820000);

      expect(result.spreadNominal).toBe(100000);
      expect(result.spreadPercent).toBeCloseTo(7.69, 2);
      expect(result.bepSellPricePerGram).toBeGreaterThan(1300000);
    });

    it("should NOT apply sell tax when gross sell is <= 10 million (e.g. 5 grams at 1,200,000 = 6 million)", () => {
      const result = calculateEmasInvestment({
        weightGrams: 5,
        priceBuyPerGram: 1300000,
        priceSellPerGram: 1200000,
        npwpStatus: "npwp",
      });

      expect(result.grossSell).toBe(6000000);
      expect(result.sellTaxRate).toBe(0);
      expect(result.sellTaxAmount).toBe(0);
      expect(result.netReceived).toBe(6000000);
    });

    it("should apply higher tax rate (0.9% buy, 3.0% sell) for Non-NPWP", () => {
      const result = calculateEmasInvestment({
        weightGrams: 10,
        priceBuyPerGram: 1300000,
        priceSellPerGram: 1200000,
        npwpStatus: "no-npwp",
      });

      expect(result.buyTaxRate).toBe(0.009);
      expect(result.buyTaxAmount).toBe(117000);
      expect(result.sellTaxRate).toBe(0.03);
      expect(result.sellTaxAmount).toBe(360000);
    });
  });

  describe("calculateCryptoTrading", () => {
    it("should calculate PMK 68 Bappebti (0.2% total tax) correctly", () => {
      const result = calculateCryptoTrading({
        amountCoins: 0.05,
        priceBuy: 1000000000,
        priceSell: 1100000000,
        feeBuyPct: 0.1,
        feeSellPct: 0.1,
        taxType: "bappebti",
      });

      expect(result.grossBuy).toBe(50000000);
      expect(result.feeBuyAmount).toBe(50000);
      expect(result.taxRate).toBe(0.002);
      expect(result.buyTaxAmount).toBe(100000);
      expect(result.totalCostBuy).toBe(50150000);

      expect(result.grossSell).toBe(55000000);
      expect(result.feeSellAmount).toBe(55000);
      expect(result.sellTaxAmount).toBe(110000);
      expect(result.netReceived).toBe(54835000);

      expect(result.netProfit).toBe(4685000);
      expect(result.roi).toBeGreaterThan(9);
      expect(result.bepPrice).toBeGreaterThan(1000000000);
    });

    it("should calculate PMK 68 Non-Bappebti (0.4% total tax) correctly", () => {
      const result = calculateCryptoTrading({
        amountCoins: 0.05,
        priceBuy: 1000000000,
        priceSell: 1100000000,
        feeBuyPct: 0.1,
        feeSellPct: 0.1,
        taxType: "non-bappebti",
      });

      expect(result.taxRate).toBe(0.004);
      expect(result.buyTaxAmount).toBe(200000);
      expect(result.sellTaxAmount).toBe(220000);
    });
  });
});
