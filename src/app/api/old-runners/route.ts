import { NextResponse } from "next/server";

// ===== Config =====
const TTL = Number(process.env.RADAR_TTL ?? 30);
const NETWORKS = (process.env.NEXT_PUBLIC_NETWORKS ?? "solana").split(",").map(s => s.trim());

// ===== Types =====
type GT_Pool = { id: string; attributes: { address: string } };
type DS_Pair = {
  chainId: string;
  pairAddress: string;
  dexId?: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { symbol: string };
  priceUsd?: string;
  liquidity?: { usd?: number };
  fdv?: number;
  txns?: { m5?: { buys: number; sells: number }, h1?: { buys: number; sells: number } };
  volume?: { m5?: number; h1?: number; h24?: number };
  priceChange?: { m5?: number; h1?: number; h6?: number; h24?: number };
  pairCreatedAt?: number; // ms
};

// ===== Utils =====
const nz = (x: any, d = 0) => (typeof x === "number" && isFinite(x) ? x : d);

async function fetchJSON(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, next: { revalidate: TTL } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

/** ดึง pools จาก GeckoTerminal หลายหน้าเพื่อขยาย source */
async function getPoolsFromGecko(network: string): Promise<string[]> {
  const allPools: string[] = [];
  
  // ดึงทั้ง trending และ new pools หลายหน้า
  const endpoints = [
    'trending_pools',
    'new_pools'
  ];
  
  for (const endpoint of endpoints) {
    for (let page = 1; page <= 3; page++) { // ดึง 3 หน้าแรก
      try {
        const url = `https://api.geckoterminal.com/api/v2/networks/${network}/${endpoint}?page=${page}`;
        const json = await fetchJSON(url);
        const data: GT_Pool[] = json?.data ?? [];
        const addresses = data.map((d) => d.attributes?.address).filter(Boolean);
        allPools.push(...addresses);
        
        // หยุดถ้าไม่มีข้อมูลแล้ว
        if (addresses.length === 0) break;
      } catch (e) {
        console.warn(`Failed to fetch ${endpoint} page ${page} for ${network}:`, e);
        break;
      }
    }
  }
  
  // ลบ duplicate
  return [...new Set(allPools)];
}

/** enrich รายละเอียดจาก DexScreener ด้วย pairAddress หลายตัว */
async function getPairs(chainId: string, pairAddresses: string[]): Promise<DS_Pair[]> {
  if (pairAddresses.length === 0) return [];
  // จำกัดครั้งละ ~30 addresses เพื่อให้ payload เบา
  const chunks: string[][] = [];
  for (let i = 0; i < pairAddresses.length; i += 30) chunks.push(pairAddresses.slice(i, i + 30));

  const results: DS_Pair[] = [];
  for (const c of chunks) {
    const url = `https://api.dexscreener.com/latest/dex/pairs/${chainId}/${c.join(",")}`;
    const j = await fetchJSON(url);
    results.push(...(j?.pairs ?? []));
  }
  return results;
}

/** กรอง "พูลเก่า >30 วันแต่เพิ่งวิ่ง" ตามเงื่อนไขที่ปรับปรุงแล้ว */
function filterOldRunners(pairs: DS_Pair[], opts = {
  minAgeMin: 43200,        // ≥30 วัน (43200 นาที)
  maxAgeMin: 259200,       // ≤180 วัน (6 เดือน) กันตาย
  minLP: 10000,            // LP ≥ $10k (ลดจาก 20k)
  minTrades1h: 30,         // Trades 1h ≥ 30 (ลดจาก 50 เพื่อให้หาเจอมากขึ้น)
  minDeltaPct: 15,         // ΔVol 5m vs 1h slice ≥ +15% (ลดจาก 20%)
  minPriceChangeH1: -5,    // PriceChange.h1 ≥ -5% (ยอมให้ร่วงเล็กน้อย)
  minPriceChangeM5: 1,     // PriceChange.m5 ≥ +1% (ลดจาก 2%)
  minBuySkew5m: 52         // Buy/Sell Skew 5m > 52% (ลดจาก 55%)
}) {
  const now = Date.now();
  
  // เพิ่ม debug logging
  console.log(`Filtering ${pairs.length} pairs with criteria:`, opts);
  
  const processed = pairs.map(p => {
    const ageMin = p.pairCreatedAt ? (now - p.pairCreatedAt) / 60000 : 1e9;
    const lp = p.liquidity?.usd ?? 0;
    const v5 = p.volume?.m5 ?? 0;
    const v1h = p.volume?.h1 ?? 0;
    const t1h = (p.txns?.h1?.buys ?? 0) + (p.txns?.h1?.sells ?? 0);
    const slice = v1h / 12; // 1 ชั่วโมง = 12 ช่วง 5 นาที
    const dVolPct = slice > 0 ? ((v5 - slice) / slice) * 100 : 0;
    
    // Price momentum indicators
    const pcm1 = p.priceChange?.h1 ?? 0;
    const pcm5 = p.priceChange?.m5 ?? 0;
    
    // Buy/Sell Skew calculation (5m) - ปรับปรุงการคำนวณ
    const buys5m = p.txns?.m5?.buys ?? 0;
    const sells5m = p.txns?.m5?.sells ?? 0;
    const totalTxns5m = buys5m + sells5m;
    const buySkew5m = totalTxns5m > 0 ? (buys5m / totalTxns5m) * 100 : 50; // default 50% ถ้าไม่มีข้อมูล

    return { p, ageMin, lp, t1h, dVolPct, pcm1, pcm5, buySkew5m, buys5m, sells5m, totalTxns5m };
  });

  // แยกการกรองเป็นขั้นตอนเพื่อ debug
  const ageFiltered = processed.filter(x => x.ageMin >= opts.minAgeMin && x.ageMin <= opts.maxAgeMin);
  console.log(`After age filter: ${ageFiltered.length}/${processed.length}`);
  
  const lpFiltered = ageFiltered.filter(x => x.lp >= opts.minLP);
  console.log(`After LP filter: ${lpFiltered.length}/${ageFiltered.length}`);
  
  const tradesFiltered = lpFiltered.filter(x => x.t1h >= opts.minTrades1h);
  console.log(`After trades filter: ${tradesFiltered.length}/${lpFiltered.length}`);
  
  const volFiltered = tradesFiltered.filter(x => x.dVolPct >= opts.minDeltaPct);
  console.log(`After volume delta filter: ${volFiltered.length}/${tradesFiltered.length}`);
  
  const priceH1Filtered = volFiltered.filter(x => x.pcm1 >= opts.minPriceChangeH1);
  console.log(`After price H1 filter: ${priceH1Filtered.length}/${volFiltered.length}`);
  
  const priceM5Filtered = priceH1Filtered.filter(x => x.pcm5 >= opts.minPriceChangeM5);
  console.log(`After price M5 filter: ${priceM5Filtered.length}/${priceH1Filtered.length}`);
  
  const buySkewFiltered = priceM5Filtered.filter(x => x.buySkew5m >= opts.minBuySkew5m);
  console.log(`After buy skew filter: ${buySkewFiltered.length}/${priceM5Filtered.length}`);

  // ถ้ายังไม่เจออะไร ให้ลองใช้เงื่อนไขที่หลวมขึ้น
  let finalFiltered = buySkewFiltered;
  if (finalFiltered.length === 0) {
    console.log("No results with strict criteria, trying relaxed filters...");
    
    // ใช้เงื่อนไขที่หลวมขึ้น
    finalFiltered = processed.filter(x =>
      x.ageMin >= opts.minAgeMin &&
      x.ageMin <= opts.maxAgeMin &&
      x.lp >= Math.max(5000, opts.minLP * 0.5) &&  // ลด LP requirement
      x.t1h >= Math.max(15, opts.minTrades1h * 0.5) &&  // ลด trades requirement
      (x.dVolPct >= opts.minDeltaPct * 0.7 || x.pcm5 >= opts.minPriceChangeM5 * 2) && // ยืดหยุ่น volume หรือ price
      x.pcm1 >= opts.minPriceChangeH1 * 1.5 &&  // ยอมให้ร่วงมากขึ้นเล็กน้อย
      (x.buySkew5m >= opts.minBuySkew5m * 0.9 || x.totalTxns5m < 5) // ยืดหยุ่น buy skew หรือถ้า txns น้อย
    );
    console.log(`Relaxed filter results: ${finalFiltered.length}`);
  }

  return finalFiltered.sort((a, b) => {
    // เรียงตาม composite score: ΔVol + Buy Skew + Price Momentum + Trades confirmation
    const scoreA = a.dVolPct + (a.buySkew5m - 50) + a.pcm5 + Math.log10(1 + a.t1h / 10);
    const scoreB = b.dVolPct + (b.buySkew5m - 50) + b.pcm5 + Math.log10(1 + b.t1h / 10);
    return scoreB - scoreA;
  });
}

// ===== API Handler =====
export const revalidate = TTL;

export async function GET(req: Request) {
  const u = new URL(req.url);

  // พารามฯ สำหรับ "พูลเก่า >30 วันแต่เพิ่งวิ่ง" - เพิ่มปัจจัยยืนยัน
  const minAgeMin = Number(u.searchParams.get("minAgeMin") ?? 43200);         // ≥30 วัน
  const maxAgeMin = Number(u.searchParams.get("maxAgeMin") ?? 259200);        // ≤180 วัน
  const minLP = Number(u.searchParams.get("minLP") ?? 20000);                 // LP ≥ $20k
  const minTrades1h = Number(u.searchParams.get("minTrades1h") ?? 50);        // Trades 1h ≥ 50 (กันการปั่น)
  const minDeltaPct = Number(u.searchParams.get("minDeltaPct") ?? 20);        // ΔVol ≥ +20%
  const minPriceChangeH1 = Number(u.searchParams.get("minPriceChangeH1") ?? 0);   // PriceChange.h1 ≥ 0%
  const minPriceChangeM5 = Number(u.searchParams.get("minPriceChangeM5") ?? 2);   // PriceChange.m5 ≥ +2%
  const minBuySkew5m = Number(u.searchParams.get("minBuySkew5m") ?? 55);          // Buy Skew 5m > 55%
  const networksParam = (u.searchParams.get("networks") ?? "").trim();
  const networks = (networksParam ? networksParam.split(",") : NETWORKS).map(s => s.trim());

  const outPerChain: Record<string, any[]> = {};
  
  for (const chain of networks) {
    try {
      const pools = await getPoolsFromGecko(chain);
      console.log(`Found ${pools.length} pools from ${chain}`);
      const pairs = await getPairs(chain, pools.slice(0, 150)); // เพิ่มจาก 90 เป็น 150
      const filtered = filterOldRunners(pairs, { 
        minAgeMin, 
        maxAgeMin, 
        minLP, 
        minTrades1h, 
        minDeltaPct, 
        minPriceChangeH1,
        minPriceChangeM5,
        minBuySkew5m
      });
      
      const results = filtered.map(x => ({
        chainId: x.p.chainId,
        pairAddress: x.p.pairAddress,
        token: x.p.baseToken,
        quote: x.p.quoteToken?.symbol,
        priceUsd: Number(x.p.priceUsd ?? 0),
        lp: x.lp,
        vol5m: nz(x.p.volume?.m5),
        vol1h: nz(x.p.volume?.h1),
        vol24h: nz(x.p.volume?.h24),
        trades1h: x.t1h,
        ageMin: Math.round(x.ageMin),
        ageDays: Math.round(x.ageMin / 1440), // แปลงเป็นวัน
        dVolPct: Number(x.dVolPct.toFixed(1)),
        priceChange: x.p.priceChange,
        priceChangeH1: Number(x.pcm1.toFixed(1)),
        priceChangeM5: Number(x.pcm5.toFixed(1)),
        buySkew5m: Number(x.buySkew5m.toFixed(1)),
        fdv: x.p.fdv ?? null,
        dexId: x.p.dexId ?? null,
        // คำนวณ hotness score สำหรับ old runners (ปรับปรุงแล้ว)
        score: Number((
          0.3 * x.dVolPct +                    // ΔVol
          0.25 * (x.buySkew5m - 50) +          // Buy Skew (เกิน 50%)
          0.2 * x.pcm5 +                       // Price momentum 5m
          0.15 * x.pcm1 +                      // Price change 1h
          0.1 * Math.log10(1 + x.t1h / 10)    // Trades confirmation
        ).toFixed(2)),
        links: {
          dexscreener: `https://dexscreener.com/${chain}/${x.p.pairAddress}`,
        }
      }));
      
      outPerChain[chain] = results.sort((a, b) => b.score - a.score);
    } catch (e: any) {
      console.error(`Error processing ${chain}:`, e.message);
      outPerChain[chain] = [];
    }
  }

  // รวมทุกเชนแล้ว sort อีกที
  const combined = Object.values(outPerChain).flat().sort((a: any, b: any) => b.score - a.score);

  return NextResponse.json({
    meta: { 
      networks, 
      minAgeMin, 
      maxAgeMin, 
      minLP, 
      minTrades1h, 
      minDeltaPct, 
      minPriceChangeH1,
      minPriceChangeM5,
      minBuySkew5m,
      ttl: TTL,
      description: "พูลเก่า >30 วันแต่เพิ่งวิ่ง - Old pools that just started running"
    },
    data: combined,
    byChain: outPerChain,
    summary: {
      totalFound: combined.length,
      byChain: Object.fromEntries(
        Object.entries(outPerChain).map(([chain, tokens]) => [chain, tokens.length])
      )
    }
  });
}
