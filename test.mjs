import assert from "node:assert";
import { fetchTopBonusTokenPools } from "./index.mjs";

const pools = await fetchTopBonusTokenPools(3);
assert.ok(Array.isArray(pools) && pools.length > 0, "Should return live DeFiLlama bonus reward pools");
console.log("PASS: defi-bonus-yield-radar fetched " + pools.length + " live bonus pools (top APY: " + pools[0].bonusApyPct + "%)");
