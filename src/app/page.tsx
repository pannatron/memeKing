'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown, RefreshCw, Filter, DollarSign, ExternalLink, Calendar, Zap, Flame } from 'lucide-react';

interface OldRunnerToken {
  chainId: string;
  pairAddress: string;
  token: {
    address: string;
    name: string;
    symbol: string;
  };
  quote: string;
  priceUsd: number;
  lp: number;
  vol5m: number;
  vol1h: number;
  vol24h: number;
  trades1h: number;
  ageMin: number;
  ageDays: number;
  dVolPct: number;
  priceChange?: {
    m5?: number;
    h1?: number;
    h6?: number;
    h24?: number;
  };
  priceChangeH1: number;
  priceChangeM5: number;
  buySkew5m: number;
  fdv?: number;
  dexId?: string;
  score: number;
  links: {
    dexscreener: string;
  };
}

interface ApiResponse {
  meta: {
    networks: string[];
    minAgeMin: number;
    maxAgeMin: number;
    minLP: number;
    minTrades1h: number;
    minDeltaPct: number;
    minPriceChangeH1: number;
    minPriceChangeM5: number;
    minBuySkew5m: number;
    ttl: number;
    description: string;
  };
  data: OldRunnerToken[];
  byChain: Record<string, OldRunnerToken[]>;
  summary: {
    totalFound: number;
    byChain: Record<string, number>;
  };
}

export default function HomePage() {
  const [tokens, setTokens] = useState<OldRunnerToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [filters, setFilters] = useState({
    minAgeMin: 43200,      // 30 วัน
    maxAgeMin: 259200,     // 180 วัน
    minLP: 10000,          // $10k (ลดจาก 20k)
    minTrades1h: 30,       // 30 trades/h (ลดจาก 50)
    minDeltaPct: 15,       // +15% ΔVol (ลดจาก 20%)
    minPriceChangeH1: -5,  // PriceChange.h1 ≥ -5% (ยอมให้ร่วงเล็กน้อย)
    minPriceChangeM5: 1,   // PriceChange.m5 ≥ +1% (ลดจาก 2%)
    minBuySkew5m: 52,      // Buy Skew 5m > 52% (ลดจาก 55%)
    networks: 'solana,base,ethereum,bsc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [meta, setMeta] = useState<ApiResponse['meta'] | null>(null);
  const [summary, setSummary] = useState<ApiResponse['summary'] | null>(null);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        minAgeMin: filters.minAgeMin.toString(),
        maxAgeMin: filters.maxAgeMin.toString(),
        minLP: filters.minLP.toString(),
        minTrades1h: filters.minTrades1h.toString(),
        minDeltaPct: filters.minDeltaPct.toString(),
        minPriceChangeH1: filters.minPriceChangeH1.toString(),
        minPriceChangeM5: filters.minPriceChangeM5.toString(),
        minBuySkew5m: filters.minBuySkew5m.toString(),
        networks: filters.networks,
      });
      
      const response = await fetch(`/api/old-runners?${params}`);
      const data: ApiResponse = await response.json();
      
      if (data.data) {
        setTokens(data.data);
        setMeta(data.meta);
        setSummary(data.summary);
        setLastUpdate(Date.now());
      }
    } catch (error) {
      console.error('Error fetching old runners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    
    // Auto-refresh every 60 seconds (longer for old runners since they change less frequently)
    const interval = setInterval(fetchTokens, 60000);
    return () => clearInterval(interval);
  }, [filters]);

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatAge = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  const getHotnessColor = (score: number): string => {
    if (score >= 50) return 'text-red-500';
    if (score >= 30) return 'text-orange-500';
    if (score >= 15) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getPriceChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getChainColor = (chainId: string): string => {
    const colors: Record<string, string> = {
      solana: 'bg-purple-500',
      ethereum: 'bg-blue-500',
      bsc: 'bg-yellow-500',
      base: 'bg-blue-400',
      polygon: 'bg-purple-600',
      arbitrum: 'bg-blue-600',
    };
    return colors[chainId] || 'bg-gray-500';
  };

  const filteredTokens = selectedChain === 'all' 
    ? tokens 
    : tokens.filter(token => token.chainId === selectedChain);

  const availableChains = Array.from(new Set(tokens.map(t => t.chainId)));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold">Meme King - Old Runners</h1>
                <p className="text-gray-400">พูลเก่า &gt;30 วันแต่เพิ่งวิ่ง - Established pools showing fresh momentum</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Chain Filter */}
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Chains</option>
                {availableChains.map(chain => (
                  <option key={chain} value={chain}>
                    {chain.charAt(0).toUpperCase() + chain.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              <button
                onClick={fetchTokens}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              {lastUpdate > 0 && (
                <div className="text-sm text-gray-400">
                  Last update: {new Date(lastUpdate).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          
          {/* Criteria Info */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div className="bg-gray-700 px-3 py-2 rounded-lg">
              <div className="text-gray-400">Pool Age</div>
              <div className="text-white font-medium">≥30 days</div>
            </div>
            <div className="bg-gray-700 px-3 py-2 rounded-lg">
              <div className="text-gray-400">Liquidity</div>
              <div className="text-white font-medium">≥$10k</div>
            </div>
            <div className="bg-gray-700 px-3 py-2 rounded-lg">
              <div className="text-gray-400">Trades/h</div>
              <div className="text-white font-medium">≥30</div>
            </div>
            <div className="bg-gray-700 px-3 py-2 rounded-lg">
              <div className="text-gray-400">ΔVol 5m</div>
              <div className="text-white font-medium">≥+15%</div>
            </div>
            <div className="bg-green-700 px-3 py-2 rounded-lg">
              <div className="text-green-200">Relaxed Criteria</div>
              <div className="text-white font-medium">More Discovery</div>
            </div>
            {summary && (
              <div className="bg-blue-700 px-3 py-2 rounded-lg">
                <div className="text-blue-200">Found</div>
                <div className="text-white font-medium">{summary.totalFound} tokens</div>
              </div>
            )}
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Min Age (days)</label>
                  <input
                    type="number"
                    value={Math.round(filters.minAgeMin / 1440)}
                    onChange={(e) => setFilters({...filters, minAgeMin: (parseInt(e.target.value) || 30) * 1440})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Age (days)</label>
                  <input
                    type="number"
                    value={Math.round(filters.maxAgeMin / 1440)}
                    onChange={(e) => setFilters({...filters, maxAgeMin: (parseInt(e.target.value) || 180) * 1440})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Min LP ($)</label>
                  <input
                    type="number"
                    value={filters.minLP}
                    onChange={(e) => setFilters({...filters, minLP: parseInt(e.target.value) || 20000})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Min ΔVol (%)</label>
                  <input
                    type="number"
                    value={filters.minDeltaPct}
                    onChange={(e) => setFilters({...filters, minDeltaPct: parseInt(e.target.value) || 20})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Min Price Δ 1h (%)</label>
                  <input
                    type="number"
                    value={filters.minPriceChangeH1}
                    onChange={(e) => setFilters({...filters, minPriceChangeH1: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Networks</label>
                  <input
                    type="text"
                    value={filters.networks}
                    onChange={(e) => setFilters({...filters, networks: e.target.value})}
                    placeholder="solana,base,ethereum"
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-lg">Scanning for old runners...</span>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4" />
                        <span>Score</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Chain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Age</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vol 5m/1h</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ΔVol%</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Liquidity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Trades/h</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Buy Skew</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price Δ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTokens.map((token, index) => (
                    <tr key={`${token.chainId}-${token.pairAddress}`} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${getHotnessColor(token.score)}`}>
                            {token.score}
                          </span>
                          <div className="text-xs text-gray-400">#{index + 1}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{token.token.symbol}</div>
                          <div className="text-xs text-gray-400 truncate max-w-32">{token.token.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getChainColor(token.chainId)}`}>
                          {token.chainId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-white font-medium">{token.ageDays}d</div>
                          <div className="text-xs text-gray-400">{formatAge(token.ageMin)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {token.priceUsd < 0.01 ? token.priceUsd.toExponential(2) : `$${token.priceUsd.toFixed(6)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-white">{formatNumber(token.vol5m)}</div>
                          <div className="text-gray-400">{formatNumber(token.vol1h)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getPriceChangeColor(token.dVolPct)}`}>
                          {token.dVolPct > 0 ? '+' : ''}{token.dVolPct}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatNumber(token.lp)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{token.trades1h}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className={`font-medium ${token.buySkew5m >= 60 ? 'text-green-500' : token.buySkew5m >= 55 ? 'text-yellow-500' : 'text-gray-400'}`}>
                            {token.buySkew5m.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">Buy Skew 5m</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className={`font-medium ${getPriceChangeColor(token.priceChangeM5)}`}>
                            5m: {token.priceChangeM5 > 0 ? '+' : ''}{token.priceChangeM5}%
                          </div>
                          <div className={`${getPriceChangeColor(token.priceChangeH1)}`}>
                            1h: {token.priceChangeH1 > 0 ? '+' : ''}{token.priceChangeH1}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={token.links.dexscreener}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredTokens.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <div className="text-gray-400 text-lg">No old runners found</div>
                <div className="text-sm text-gray-500 mt-2">
                  Old established pools with fresh momentum are rare. Try adjusting your criteria or check back later.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
