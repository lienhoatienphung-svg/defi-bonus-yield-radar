#!/usr/bin/env node
/**
 * defi-bonus-yield-radar — Live DeFi Bonus Reward Token & DexScreener Boosted Coin CLI Radar
 * Zero external dependencies. Runs natively on Node.js 18+.
 */

export async function fetchTopBonusTokenPools(limit = 5) {
  const res = await fetch("https://yields.llama.fi/pools", {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(12000),
  });
  const body = await res.json();
  const pools = Array.isArray(body?.data) ? body.data : [];
  return pools
    .filter(
      (p) =>
        ["Base", "Arbitrum", "Optimism", "Solana"].includes(String(p?.chain)) &&
        Number(p?.apyReward || 0) > 5 &&
        Number(p?.tvlUsd || 0) > 100000,
    )
    .sort((a, b) => Number(b.apyReward || 0) - Number(a.apyReward || 0))
    .slice(0, limit)
    .map((p) => ({
      chain: p.chain,
      project: p.project,
      symbol: p.symbol,
      tvlUsd: Math.round(Number(p.tvlUsd)),
      bonusApyPct: Math.round(Number(p.apyReward) * 100) / 100,
      totalApyPct: Math.round(Number(p.apy) * 100) / 100,
      rewardTokens: p.rewardTokens,
    }));
}

if (process.argv.includes("--demo")) {
  const pools = await fetchTopBonusTokenPools(5);
  console.log(JSON.stringify({ fetchedAt: new Date().toISOString(), topBonusPools: pools }, null, 2));
}
