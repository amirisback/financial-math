"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { TraderPersona } from "@/lib/trader-personas-data";
import {
  calculateScalperFrictionRuin,
  calculateGrahamNetNet,
  calculateGarpPeg,
  calculateBandarmologiConcentration,
  calculateMinerviniVcp,
  calculateDividendYieldAndTrap,
  calculateBramantyoPositionRisk,
} from "@/lib/trader-persona-math";

interface PersonaFormulaSimulatorProps {
  persona: TraderPersona;
  dict: Dictionary;
}

export function PersonaFormulaSimulator({ persona, dict }: PersonaFormulaSimulatorProps) {
  // State for Scalper Fee Ruin
  const [scalpGainTicks, setScalpGainTicks] = useState<number>(2);
  const [scalpLossTicks, setScalpLossTicks] = useState<number>(1);

  // State for Graham Net-Net
  const [currentAssets, setCurrentAssets] = useState<number>(100_000_000_000);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(40_000_000_000);
  const [sharesOutstanding, setSharesOutstanding] = useState<number>(100_000_000);
  const [marketPrice, setMarketPrice] = useState<number>(350);

  // State for GARP PEG
  const [perRatio, setPerRatio] = useState<number>(12);
  const [epsGrowth, setEpsGrowth] = useState<number>(20);

  // State for Bandarmologi
  const [topBuyLotsText, setTopBuyLotsText] = useState<string>("50000, 30000, 20000, 5000, 5000");
  const [topSellLotsText, setTopSellLotsText] = useState<string>("10000, 10000, 10000, 10000, 10000");
  const [buyerBrokersText, setBuyerBrokersText] = useState<string>("AK, BK, KZ, RX, CC");
  const [sellerBrokersText, setSellerBrokersText] = useState<string>("YP, PD, XC, XL, NI");

  // State for VCP Minervini
  const [contractionsText, setContractionsText] = useState<string>("-15, -8, -3");
  const [breakoutVol, setBreakoutVol] = useState<number>(3_000_000);
  const [avg20Vol, setAvg20Vol] = useState<number>(1_500_000);

  // State for Dividend Trap
  const [dividendPerShare, setDividendPerShare] = useState<number>(300);
  const [divStockPrice, setDivStockPrice] = useState<number>(2500);
  const [fcfCoverage, setFcfCoverage] = useState<number>(1.2);

  // State for Generic Risk Sizing
  const [genCapital, setGenCapital] = useState<number>(100_000_000);
  const [genEntry, setGenEntry] = useState<number>(2600);
  const [genSl, setGenSl] = useState<number>(2470);
  const [genAdv, setGenAdv] = useState<number>(10_000_000);

  // Render sub-simulators based on persona.specialSimulatorType
  const renderSimulatorBody = () => {
    switch (persona.specialSimulatorType) {
      case "fee_ruin": {
        const result = calculateScalperFrictionRuin(scalpGainTicks, scalpLossTicks);
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border">
              <h4 className="text-xs font-bold text-foreground mb-3">
                Kalkulator Keruntuhan Matematis Scalper di BEI (Friksi Komisi Round-Trip 0.40%)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Target Take Profit (Jumlah Tick, misal 1 tick = 0.40%):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={scalpGainTicks}
                    onChange={(e) => setScalpGainTicks(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Target Stop Loss (Jumlah Tick):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={scalpLossTicks}
                    onChange={(e) => setScalpLossTicks(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">RRR Teoretis (Kotor):</span>
                <span className="text-sm font-bold text-foreground">{result.theoreticalRrr} : 1</span>
                <span className="text-[10px] text-muted-foreground block">Gross Gain: +{result.grossGainPct}%</span>
              </div>
              <div className={`p-3.5 rounded-2xl border ${result.isInvertedRrr ? "border-rose-300 bg-rose-50/50 dark:bg-rose-950/20" : "border-emerald-300 bg-emerald-50/50"}`}>
                <span className="text-[10px] text-muted-foreground block">Efektif RRR Net (Pasca Fee):</span>
                <span className={`text-base font-extrabold ${result.isInvertedRrr ? "text-rose-600 dark:text-rose-400" : "text-emerald-600"}`}>
                  1 : {(1 / (result.effectiveNetRrr || 0.5)).toFixed(1)} {result.isInvertedRrr && "(Terbalik!)"}
                </span>
                <span className="text-[10px] text-muted-foreground block">Net Gain: +{result.netGainPct}%</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Net Loss Pasca Fee:</span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">-{result.netLossPct}%</span>
                <span className="text-[10px] text-muted-foreground block">Fee Round-Trip: 0.40%</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20">
                <span className="text-[10px] text-indigo-700 dark:text-indigo-300 block font-bold">Break-Even Win Rate:</span>
                <span className="text-base font-black text-indigo-700 dark:text-indigo-300">
                  {result.breakEvenWinRatePct}%
                </span>
                <span className="text-[10px] text-muted-foreground block">Ambang Batas Impas</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${result.isInvertedRrr ? "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300" : "border-emerald-300 bg-emerald-50 text-emerald-800"}`}>
              {result.verdictMessage}
            </div>
          </div>
        );
      }

      case "net_net": {
        const result = calculateGrahamNetNet(currentAssets, totalLiabilities, sharesOutstanding, marketPrice);
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-foreground">
                Kalkulator Benjamin Graham Net-Net NCAV (Net Current Asset Value)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Total Aset Lancar (Current Assets IDR):
                  </label>
                  <input
                    type="number"
                    value={currentAssets}
                    onChange={(e) => setCurrentAssets(Number(e.target.value) || 0)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Total Seluruh Liabilitas/Utang (IDR):
                  </label>
                  <input
                    type="number"
                    value={totalLiabilities}
                    onChange={(e) => setTotalLiabilities(Number(e.target.value) || 0)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Jumlah Saham Beredar (Lembar):
                  </label>
                  <input
                    type="number"
                    value={sharesOutstanding}
                    onChange={(e) => setSharesOutstanding(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Harga Pasar Saham Saat Ini (Rp):
                  </label>
                  <input
                    type="number"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">NCAV Total:</span>
                <span className="text-xs font-extrabold text-foreground">
                  Rp {(result.ncavTotal / 1_000_000_000).toFixed(1)} Miliar
                </span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">NCAV per Lembar:</span>
                <span className="text-sm font-extrabold text-foreground">Rp {result.ncavPerShare}</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block font-bold">2/3 NCAV Graham:</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">Rp {result.twoThirdsNcav}</span>
                <span className="text-[10px] text-muted-foreground block">Batas Maksimal Beli</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Margin of Safety:</span>
                <span className={`text-sm font-black ${result.marginOfSafetyPct > 33 ? "text-emerald-600" : "text-amber-600"}`}>
                  {result.marginOfSafetyPct}%
                </span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${result.isDeepValue ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300" : "border-card-border bg-muted/40 text-muted-foreground"}`}>
              {result.verdictMessage}
            </div>
          </div>
        );
      }

      case "peg": {
        const result = calculateGarpPeg(perRatio, epsGrowth);
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-foreground">
                Kalkulator GARP Peter Lynch (Price/Earnings-to-Growth Ratio)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Price to Earnings Ratio (PER):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={perRatio}
                    onChange={(e) => setPerRatio(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Laju Pertumbuhan EPS Tahunan (Growth %):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={epsGrowth}
                    onChange={(e) => setEpsGrowth(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-card-border bg-background text-sm font-bold text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Rasio PER vs Growth:</span>
                <span className="text-sm font-extrabold text-foreground">{perRatio}x / {epsGrowth}%</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20">
                <span className="text-[10px] text-indigo-700 dark:text-indigo-300 block font-bold">PEG Ratio:</span>
                <span className="text-xl font-black text-indigo-700 dark:text-indigo-300">{result.pegRatio}</span>
                <span className="text-[10px] text-muted-foreground block">Batas Standar: &le; 1.0</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Status Valuasi:</span>
                <span className={`text-sm font-black ${result.valuationStatus === "UNDERVALUED" ? "text-emerald-600" : result.valuationStatus === "FAIR" ? "text-amber-600" : "text-rose-600"}`}>
                  {result.valuationStatus}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-card-border bg-muted/40 text-xs text-foreground/80 leading-relaxed">
              {result.verdictMessage}
            </div>
          </div>
        );
      }

      case "broksum": {
        const buyLots = topBuyLotsText.split(",").map((s) => Number(s.trim()) || 0);
        const sellLots = topSellLotsText.split(",").map((s) => Number(s.trim()) || 0);
        const buyerBrokers = buyerBrokersText.split(",").map((s) => s.trim());
        const sellerBrokers = sellerBrokersText.split(",").map((s) => s.trim());

        const result = calculateBandarmologiConcentration(buyLots, sellLots, [], buyerBrokers, sellerBrokers);

        return (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-foreground">
                Kalkulator Broker Summary Concentration (CR3/CR5) & Aliran Bandar BEI
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Lot Top 5 Broker Pembeli (pisahkan koma):
                  </label>
                  <input
                    type="text"
                    value={topBuyLotsText}
                    onChange={(e) => setTopBuyLotsText(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-mono font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Kode Top Broker Pembeli (misal AK, BK, KZ):
                  </label>
                  <input
                    type="text"
                    value={buyerBrokersText}
                    onChange={(e) => setBuyerBrokersText(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-mono font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Lot Top 5 Broker Penjual (pisahkan koma):
                  </label>
                  <input
                    type="text"
                    value={topSellLotsText}
                    onChange={(e) => setTopSellLotsText(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-mono font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Kode Top Broker Penjual (misal YP, PD, XC):
                  </label>
                  <input
                    type="text"
                    value={sellerBrokersText}
                    onChange={(e) => setSellerBrokersText(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-mono font-bold text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">CR3 (Top 3 Buyers):</span>
                <span className={`text-base font-black ${result.cr3Pct >= 65 ? "text-emerald-600" : "text-foreground"}`}>
                  {result.cr3Pct}%
                </span>
                <span className="text-[10px] text-muted-foreground block">Ambang Akumulasi: &gt; 65%</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">CR5 (Top 5 Buyers):</span>
                <span className="text-base font-extrabold text-foreground">{result.cr5Pct}%</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Sinyal Bandarmologi:</span>
                <span className={`text-xs font-black ${result.flowSignal === "BIG_ACCUMULATION" ? "text-emerald-600" : result.flowSignal === "BIG_DISTRIBUTION" ? "text-rose-600" : "text-amber-600"}`}>
                  {result.flowSignal}
                </span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${result.flowSignal === "BIG_ACCUMULATION" ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300" : result.flowSignal === "BIG_DISTRIBUTION" ? "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300" : "border-card-border bg-muted/40 text-foreground/80"}`}>
              {result.verdictMessage}
            </div>
          </div>
        );
      }

      case "vcp": {
        const contractions = contractionsText.split(",").map((s) => Number(s.trim()) || 0);
        const result = calculateMinerviniVcp(contractions, breakoutVol, avg20Vol);

        return (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-foreground">
                Kalkulator Mark Minervini Volatility Contraction Pattern (VCP)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Kedalaman Kontraksi % (misal -16, -8, -3):
                  </label>
                  <input
                    type="text"
                    value={contractionsText}
                    onChange={(e) => setContractionsText(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-mono font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Volume Hari Breakout (Lembar):
                  </label>
                  <input
                    type="number"
                    value={breakoutVol}
                    onChange={(e) => setBreakoutVol(Number(e.target.value) || 0)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Rata-rata Volume 20 Hari (SMA 20 Vol):
                  </label>
                  <input
                    type="number"
                    value={avg20Vol}
                    onChange={(e) => setAvg20Vol(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Pola Kontraksi:</span>
                <span className={`text-xs font-extrabold ${result.isProgressivelyTighter ? "text-emerald-600" : "text-rose-600"}`}>
                  {result.isProgressivelyTighter ? "Menyempit (Valid)" : "Tidak Menyempit (Gagal)"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Lonjakan Volume Breakout:</span>
                <span className={`text-base font-black ${result.isVolumeValid ? "text-emerald-600" : "text-amber-600"}`}>
                  {result.volumeSurgeRatio}%
                </span>
                <span className="text-[10px] text-muted-foreground block">Batas Valid: &ge; 150%</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Status Setup VCP:</span>
                <span className={`text-xs font-black ${result.isSetupValid ? "text-emerald-600" : "text-rose-600"}`}>
                  {result.isSetupValid ? "TERKONFIRMASI" : "BELUM MATANG"}
                </span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${result.isSetupValid ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300" : "border-card-border bg-muted/40 text-foreground/80"}`}>
              {result.verdictMessage}
            </div>
          </div>
        );
      }

      case "dividend_trap": {
        const result = calculateDividendYieldAndTrap(dividendPerShare, divStockPrice, fcfCoverage);
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-foreground">
                Kalkulator Dividend Yield & Filter Bahaya Ex-Date Trap
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Dividen per Lembar (DPS Rp):
                  </label>
                  <input
                    type="number"
                    value={dividendPerShare}
                    onChange={(e) => setDividendPerShare(Number(e.target.value) || 0)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Harga Saham Saat Ini (Rp):
                  </label>
                  <input
                    type="number"
                    value={divStockPrice}
                    onChange={(e) => setDivStockPrice(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    FCF Coverage Ratio (Kas Operasi / Dividen):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fcfCoverage}
                    onChange={(e) => setFcfCoverage(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Dividend Yield:</span>
                <span className="text-base font-black text-emerald-600">{result.dividendYieldPct}%</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Buffer Koreksi Ex-Date:</span>
                <span className="text-sm font-bold text-foreground">-{result.recommendedBufferPct}%</span>
                <span className="text-[10px] text-muted-foreground block">Estimasi gap down</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Tingkat Risiko Trap:</span>
                <span className={`text-xs font-black ${result.trapRisk === "HIGH_DANGER" ? "text-rose-600" : result.trapRisk === "MODERATE" ? "text-amber-600" : "text-emerald-600"}`}>
                  {result.trapRisk}
                </span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${result.trapRisk === "HIGH_DANGER" ? "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300" : "border-card-border bg-muted/40 text-foreground/80"}`}>
              {result.verdictMessage}
            </div>
          </div>
        );
      }

      default: {
        // Generic: Bramantyo 1% Risk & ADV Liquidity Position Sizing
        const result = calculateBramantyoPositionRisk(genCapital, genEntry, genSl, genAdv);
        return (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-foreground">
                Formula Standar Institusi: Alokasi Posisi 1% Account Risk & Cek Likuiditas ADV (Bramantyo)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Modal Portofolio (Rp):
                  </label>
                  <input
                    type="number"
                    value={genCapital}
                    onChange={(e) => setGenCapital(Number(e.target.value) || 0)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Harga Beli / Entry (Rp):
                  </label>
                  <input
                    type="number"
                    value={genEntry}
                    onChange={(e) => setGenEntry(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Harga Stop Loss (Rp):
                  </label>
                  <input
                    type="number"
                    value={genSl}
                    onChange={(e) => setGenSl(Number(e.target.value) || 1)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                    Average Daily Volume (Lembar):
                  </label>
                  <input
                    type="number"
                    value={genAdv}
                    onChange={(e) => setGenAdv(Number(e.target.value) || 0)}
                    className="w-full min-h-[44px] px-3 rounded-xl border border-card-border bg-background text-xs font-bold text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl border border-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20">
                <span className="text-[10px] text-indigo-700 dark:text-indigo-300 block font-bold">Maksimal Ukuran Lot:</span>
                <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">{result.maxLots} Lot</span>
                <span className="text-[10px] text-muted-foreground block">{result.maxShares.toLocaleString("id-ID")} Lembar</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Nilai Transaksi:</span>
                <span className="text-xs font-extrabold text-foreground">
                  Rp {result.transactionValueIdr.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-muted-foreground block">{result.positionPercentOfCapital}% dari modal</span>
              </div>
              <div className="p-3.5 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.02]">
                <span className="text-[10px] text-muted-foreground block">Risiko Terproteksi (1%):</span>
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                  Rp {result.maxRiskAmountIdr.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-muted-foreground block">Jarak SL: {result.priceRiskDistancePct}%</span>
              </div>
              <div className={`p-3.5 rounded-2xl border ${result.advCriticalDanger ? "border-rose-300 bg-rose-50/50" : "border-card-border bg-black/[0.01] dark:bg-white/[0.02]"}`}>
                <span className="text-[10px] text-muted-foreground block">Porsi Terhadap ADV:</span>
                <span className={`text-sm font-black ${result.advCriticalDanger ? "text-rose-600" : "text-foreground"}`}>
                  {result.positionAdvPct}%
                </span>
                <span className="text-[10px] text-muted-foreground block">Batas Aman: &le; 5-10%</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${result.advCriticalDanger ? "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300" : "border-card-border bg-muted/40 text-foreground/80"}`}>
              {result.verdictMessage}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div id="formula-simulator-section" className="rounded-3xl border border-card-border bg-card p-5 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-card-border pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <span>🧮</span>
            <span>{dict.traderBot.simulatorTitle}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-foreground">
            Simulator Formula Spesifik: {persona.name}
          </h3>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Lead Formulator: <strong className="text-foreground">{persona.leadAnalyst}</strong>
        </span>
      </div>

      {renderSimulatorBody()}
    </div>
  );
}
