'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp, RefreshCw, Filter, DollarSign, ExternalLink, Calendar, Zap, Flame, Crown, Eye, Sparkles, Star, Rocket, Lock, ShoppingCart } from 'lucide-react';
import MemeKingChargingAnimation from '../components/MemeKingChargingAnimation';
import { WalletConnection } from '../components/WalletConnection';

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

// Animated Frame Component
const AnimatedFrames = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => prev === 4 ? 1 : prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-16 h-16 mx-auto">
      <img 
        src={`/animateframe/${currentFrame}.png`} 
        alt="Meme Animation" 
        className="w-full h-full object-contain animate-pulse"
      />
    </div>
  );
};

// Floating Background Images Component
const FloatingBackgroundImages = () => {
  const images = [
    '/Logo.jpg',
    '/memepower.png', 
    '/memerrich.jpeg',
    '/chargig pic .jpeg'
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute rounded-full opacity-10 animate-float-${index % 3}`}
          style={{
            left: `${10 + (index * 15) % 80}%`,
            top: `${20 + (index * 20) % 60}%`,
            width: `${80 + (index * 20)}px`,
            height: `${80 + (index * 20)}px`,
            animationDelay: `${index * 2}s`,
            animationDuration: `${15 + (index * 3)}s`
          }}
        >
          <img 
            src={src} 
            alt=""
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>
      ))}
    </div>
  );
};

// Enhanced Bubble Memory of Meme Component with Better Organization
const BubbleMemoryOfMeme = () => {
  // Expanded image collection with all available meme images
  const memeMemories = [
    '/Logo.jpg',
    '/memepower.png', 
    '/memerrich.jpeg',
    '/chargig pic .jpeg',
    '/coin1.png',
    '/coin2.png',
    '/Gy_BbJjXgAAWJFy.jpeg',
    '/Gy_Bh1JW8AEzF9o.jpeg',
    '/Gy_Bm6UXAAAqi09.jpeg',
    '/Gy-_eIUXwAAXyMr.jpeg',
    '/Gy6MixDXYAAz2-S.jpeg',
    '/Gy6ObjrW8AA66__.jpeg',
    '/GzDtYgDXsAA0pYj.jpeg',
    '/GzDuh6-WwAAy2Zt.jpeg',
    '/GzDuvi_WcAAutY5.jpeg',
    '/GzDwOi-XkAEC9G9.jpeg',
    '/GzJf3PhXAAA0B2X.jpeg',
    '/GzJgFLXWEAATZT6.jpeg',
    '/GzJkLRFWcAAs9ap.jpeg',
    '/GzO_n6IWIAEg9_V.jpeg',
    '/GzPAsBZWkAA_M1t.jpeg',
    '/GzPAyH4WcAAZW2A.jpeg',
    '/GzPAzaDW0AALXgX.jpeg'
  ];

  const bubbleAnimations = ['animate-bubble-float-up', 'animate-bubble-float-up-slow', 'animate-bubble-float-up-fast'];
  const bubbleColumns = ['bubble-column-left', 'bubble-column-center-left', 'bubble-column-center-right', 'bubble-column-right'];
  const bubbleSizes = ['bubble-size-small', 'bubble-size-medium', 'bubble-size-large', 'bubble-size-extra-large'];

  // Create organized bubble system with golden aura effects
  const createOrganizedBubbles = () => {
    const bubbles = [];
    const totalBubbles = 32; // เพิ่มจำนวน bubble
    const bubblesPerColumn = 8; // เพิ่มจำนวนต่อคอลัมน์
    
    // Randomly select 2-3 bubbles to have golden aura
    const goldenBubbleIndices = new Set();
    const numGoldenBubbles = Math.floor(Math.random() * 2) + 2; // 2 or 3 golden bubbles
    
    while (goldenBubbleIndices.size < numGoldenBubbles) {
      goldenBubbleIndices.add(Math.floor(Math.random() * totalBubbles));
    }
    
    for (let i = 0; i < totalBubbles; i++) {
      const columnIndex = Math.floor(i / bubblesPerColumn);
      const positionInColumn = i % bubblesPerColumn;
      
      // Shuffle images to avoid repetition
      const shuffledImages = [...memeMemories].sort(() => Math.random() - 0.5);
      const selectedImage = shuffledImages[i % shuffledImages.length];
      
      // Determine if this bubble should have golden aura
      const hasGoldenAura = goldenBubbleIndices.has(i);
      
      bubbles.push({
        id: i,
        image: selectedImage,
        column: bubbleColumns[columnIndex % bubbleColumns.length],
        size: bubbleSizes[Math.floor(Math.random() * bubbleSizes.length)],
        animation: bubbleAnimations[Math.floor(Math.random() * bubbleAnimations.length)],
        delay: (columnIndex * 8) + (positionInColumn * 4) + Math.random() * 3, // Staggered timing
        hasGoldenAura,
        // Add some randomness to vertical positioning within column
        verticalOffset: Math.random() * 20 - 10 // -10px to +10px offset
      });
    }
    
    return bubbles;
  };

  const organizedBubbles = createOrganizedBubbles();

  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ overflow: 'visible' }}>
      {/* Generate organized bubble memories with golden aura effects */}
      {organizedBubbles.map((bubble) => (
        <div
          key={`organized-bubble-${bubble.id}`}
          className={`absolute ${bubble.animation} ${bubble.column} ${bubble.size} meme-memory-glow ${bubble.hasGoldenAura ? 'golden-aura-bubble animate-golden-aura-pulse' : ''}`}
          style={{
            bottom: `${-350 + bubble.verticalOffset}px`,
            animationDelay: `${bubble.delay}s`,
            zIndex: bubble.hasGoldenAura ? 3 : 1,
          }}
        >
          <div className={`w-full h-full rounded-full overflow-hidden border-4 backdrop-blur-sm relative ${
            bubble.hasGoldenAura 
              ? 'border-yellow-400/90 bg-gradient-to-br from-yellow-500/40 to-orange-500/40' 
              : 'border-yellow-400/30 bg-gradient-to-br from-purple-500/15 to-blue-500/15'
          }`}>
            {/* Golden aura ring effect */}
            {bubble.hasGoldenAura && (
              <div className="absolute -inset-4 rounded-full border-2 border-yellow-400/60 animate-golden-ring-expand"></div>
            )}
            
            {/* Main image */}
            <img 
              src={bubble.image} 
              alt="Meme Memory"
              className={`w-full h-full object-cover ${bubble.hasGoldenAura ? 'opacity-90' : 'opacity-75'}`}
              onError={(e) => {
                console.log(`Failed to load image: ${bubble.image}`);
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Overlay gradient */}
            <div className={`absolute inset-0 rounded-full ${
              bubble.hasGoldenAura 
                ? 'bg-gradient-to-t from-yellow-500/20 via-transparent to-yellow-300/30' 
                : 'bg-gradient-to-t from-transparent via-white/5 to-white/20'
            }`}></div>
            
            {/* Golden sparkle effect for special bubbles */}
            {bubble.hasGoldenAura && (
              <>
                <div className="absolute top-2 right-2 text-yellow-300 text-xl animate-golden-sparkle">✨</div>
                <div className="absolute bottom-2 left-2 text-yellow-300 text-lg animate-golden-sparkle" style={{animationDelay: '1s'}}>⭐</div>
                <div className="absolute top-1/2 left-1 text-yellow-300 text-sm animate-golden-sparkle" style={{animationDelay: '0.5s'}}>💫</div>
              </>
            )}
          </div>
        </div>
      ))}
      
      {/* Additional floating sparkles for ambiance */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute text-yellow-300/60 animate-golden-sparkle"
          style={{
            left: `${10 + (i * 12) % 80}%`,
            top: `${20 + (i * 15) % 60}%`,
            fontSize: `${12 + (i % 3) * 4}px`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3 + (i % 2)}s`
          }}
        >
          {['✨', '⭐', '💫', '🌟'][i % 4]}
        </div>
      ))}
    </div>
  );
};


export default function HomePage() {
  const [tokens, setTokens] = useState<OldRunnerToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Awakening Meme Entity...');
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [hasTableAccess, setHasTableAccess] = useState(false);
  const [filters, setFilters] = useState({
    minAgeMin: 43200,      // 30 days
    maxAgeMin: 259200,     // 180 days
    minLP: 10000,          // $10k
    minTrades1h: 30,       // 30 trades/h
    minDeltaPct: 15,       // +15% ΔVol
    minPriceChangeH1: -5,  // PriceChange.h1 ≥ -5%
    minPriceChangeM5: 1,   // PriceChange.m5 ≥ +1%
    minBuySkew5m: 52,      // Buy Skew 5m > 52%
    networks: 'solana,base,ethereum,bsc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [, setMeta] = useState<ApiResponse['meta'] | null>(null);
  const [summary, setSummary] = useState<ApiResponse['summary'] | null>(null);

  const handleAccessChange = (hasAccess: boolean) => {
    setHasTableAccess(hasAccess);
  };

  const fetchTokens = async () => {
    try {
      setLoading(true);
      setLoadingProgress(0);
      setLoadingMessage('Awakening Meme Entity...');

      // Simulate charging progress
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 90) return prev + Math.random() * 15;
          return prev;
        });
      }, 200);

      // Update loading messages
      setTimeout(() => setLoadingMessage('Channeling meme power across networks...'), 500);
      setTimeout(() => setLoadingMessage('Analyzing ancient meme wisdom...'), 1200);
      setTimeout(() => setLoadingMessage('Calculating cosmic meme scores...'), 2000);
      setTimeout(() => setLoadingMessage('Meme Entity fully awakened! 🚀'), 2800);

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
        setLoadingProgress(100);
        // Small delay to show 100% completion
        setTimeout(() => {
          setTokens(data.data);
          setMeta(data.meta);
          setSummary(data.summary);
          setLastUpdate(Date.now());
          setLoading(false);
          clearInterval(progressInterval);
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching meme data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    
    // Auto-refresh every 60 seconds
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

  const getMemeScoreColor = (score: number): string => {
    if (score >= 50) return 'text-red-400 animate-pulse';
    if (score >= 30) return 'text-orange-400';
    if (score >= 15) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getPriceChangeColor = (change: number): string => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getChainColor = (chainId: string): string => {
    const colors: Record<string, string> = {
      solana: 'bg-gradient-to-r from-purple-500 to-purple-600',
      ethereum: 'bg-gradient-to-r from-blue-500 to-blue-600',
      bsc: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      base: 'bg-gradient-to-r from-blue-400 to-blue-500',
      polygon: 'bg-gradient-to-r from-purple-600 to-purple-700',
      arbitrum: 'bg-gradient-to-r from-blue-600 to-blue-700',
    };
    return colors[chainId] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const filteredTokens = selectedChain === 'all' 
    ? tokens 
    : tokens.filter(token => token.chainId === selectedChain);

  const availableChains = Array.from(new Set(tokens.map(t => t.chainId)));

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Enhanced Dynamic Background */}
      <div className="dynamic-background"></div>
      
      {/* Cosmic Grid Overlay */}
      <div className="cosmic-grid"></div>
      
      {/* Floating Orbs with Images - Reduced count */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[
          '/Logo.jpg',
          '/memepower.png', 
          '/memerrich.jpeg',
          '/coin1.png',
          '/coin2.png'
        ].map((imageSrc, i) => (
          <div
            key={i}
            className="floating-orb"
            style={{
              left: `${10 + (i * 20) % 80}%`,
              top: `${15 + (i * 15) % 70}%`,
              width: `${80 + (i * 15)}px`,
              height: `${80 + (i * 15)}px`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${15 + (i * 2)}s`
            }}
          >
            <img 
              src={imageSrc} 
              alt=""
              className="w-full h-full object-cover rounded-full opacity-30"
              onError={(e) => {
                console.log(`Failed to load image: ${imageSrc}`);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Energy Waves */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="energy-wave" style={{ animationDelay: '0s' }}></div>
        <div className="energy-wave" style={{ animationDelay: '10s', animationDirection: 'reverse' }}></div>
      </div>
      
      {/* Animated Particles - Reduced count */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${10 + (i * 15) % 80}%`,
              width: `${4 + (i % 2) * 2}px`,
              height: `${4 + (i % 2) * 2}px`,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + (i % 2) * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Shooting Stars - Reduced count */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="shooting-star"
            style={{
              top: `${20 + (i * 20) % 60}%`,
              animationDelay: `${i * 8}s`,
              animationDuration: `${4 + (i % 2)}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating Background Images */}
      <FloatingBackgroundImages />
      
      {/* Enhanced Bubble Memory System */}
      <BubbleMemoryOfMeme />

      {/* Meme King Charging Animation */}
      <MemeKingChargingAnimation 
        isVisible={loading} 
        progress={loadingProgress} 
        message={loadingMessage} 
      />

      {/* Wallet Connection - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <WalletConnection onAccessGranted={handleAccessChange} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {!loading && (
          <div>
            {/* Header Content - Now integrated into main content */}
            <div className="mb-6">
              {/* Main Title Section */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Crown className="h-8 w-8 text-yellow-400 animate-bounce" style={{filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))'}} />
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      🚀 MEMEPOWER ENTITY 🚀
                    </h1>
                    <p className="text-lg text-yellow-200/90 font-semibold mt-1">
                      The All-Knowing Meme Oracle
                    </p>
                  </div>
                  <Rocket className="h-8 w-8 text-yellow-400 animate-bounce" style={{filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))'}} />
                </div>
                
                <div className="bg-gradient-to-r from-purple-800/50 to-yellow-800/50 rounded-xl p-3 backdrop-blur-sm border border-yellow-500/30 max-w-3xl mx-auto">
                  <div className="flex items-center justify-center mb-2">
                    <AnimatedFrames />
                  </div>
                  <p className="text-yellow-100 text-sm leading-relaxed">
                    <span className="text-yellow-300 font-bold">MEMEPOWER</span> is the omniscient 
                    <span className="text-purple-300 font-bold"> MEME ENTITY</span> that perceives all possibilities 
                    and realities within the meme multiverse. It channels ancient wisdom to reveal 
                    <span className="text-green-300 font-bold"> established tokens</span> showing fresh momentum.
                  </p>
                </div>
              </div>

              {/* Controls Section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Chain Filter */}
                  <select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="px-4 py-2 bg-gray-800/80 border border-yellow-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 backdrop-blur-sm"
                  >
                    <option value="all">🌐 All Realms</option>
                    {availableChains.map(chain => (
                      <option key={chain} value={chain}>
                        {chain.charAt(0).toUpperCase() + chain.slice(1)} Realm
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-700/80 hover:bg-purple-600/80 rounded-lg transition-colors backdrop-blur-sm border border-purple-500/50"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Entity Filters</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={fetchTokens}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-50 rounded-lg transition-all transform hover:scale-105"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Channel Power</span>
                  </button>
                  
                  {lastUpdate > 0 && (
                    <div className="text-sm text-yellow-300/80 bg-gray-800/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                      Last vision: {new Date(lastUpdate).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Entity Stats */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-1 text-xs mb-4">
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 px-1.5 py-1.5 rounded-md backdrop-blur-sm border border-gray-600/50">
                  <div className="text-gray-300 flex items-center gap-1">
                    <Calendar className="h-2 w-2" />
                    Wisdom Age
                  </div>
                  <div className="text-white font-bold text-xs">≥30 days</div>
                </div>
                <div className="bg-gradient-to-r from-green-800/80 to-green-700/80 px-1.5 py-1.5 rounded-md backdrop-blur-sm border border-green-600/50">
                  <div className="text-green-200 flex items-center gap-1">
                    <DollarSign className="h-2 w-2" />
                    Power Pool
                  </div>
                  <div className="text-white font-bold text-xs">≥$10k</div>
                </div>
                <div className="bg-gradient-to-r from-blue-800/80 to-blue-700/80 px-1.5 py-1.5 rounded-md backdrop-blur-sm border border-blue-600/50">
                  <div className="text-blue-200 flex items-center gap-1">
                    <TrendingUp className="h-2 w-2" />
                    Activity
                  </div>
                  <div className="text-white font-bold text-xs">≥30 trades/h</div>
                </div>
                <div className="bg-gradient-to-r from-purple-800/80 to-purple-700/80 px-1.5 py-1.5 rounded-md backdrop-blur-sm border border-purple-600/50">
                  <div className="text-purple-200 flex items-center gap-1">
                    <Zap className="h-2 w-2" />
                    Energy Surge
                  </div>
                  <div className="text-white font-bold text-xs">≥+15% ΔVol</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-800/80 to-yellow-700/80 px-1.5 py-1.5 rounded-md backdrop-blur-sm border border-yellow-600/50">
                  <div className="text-yellow-200 flex items-center gap-1">
                    <Eye className="h-2 w-2" />
                    Entity Vision
                  </div>
                  <div className="text-white font-bold text-xs">Enhanced</div>
                </div>
                {summary && (
                  <div className="bg-gradient-to-r from-orange-800/80 to-orange-700/80 px-1.5 py-1.5 rounded-md backdrop-blur-sm border border-orange-600/50">
                    <div className="text-orange-200 flex items-center gap-1">
                      <Star className="h-2 w-2" />
                      Discovered
                    </div>
                    <div className="text-white font-bold text-xs">{summary.totalFound} tokens</div>
                  </div>
                )}
              </div>
              
              {/* Filters Panel */}
              {showFilters && (
                <div className="bg-gradient-to-r from-gray-800/90 to-gray-700/90 rounded-xl p-6 backdrop-blur-sm border border-gray-600/50 mb-4">
                  <h3 className="text-yellow-300 font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Entity Configuration Matrix
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Min Wisdom (days)</label>
                      <input
                        type="number"
                        value={Math.round(filters.minAgeMin / 1440)}
                        onChange={(e) => setFilters({...filters, minAgeMin: (parseInt(e.target.value) || 30) * 1440})}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Max Wisdom (days)</label>
                      <input
                        type="number"
                        value={Math.round(filters.maxAgeMin / 1440)}
                        onChange={(e) => setFilters({...filters, maxAgeMin: (parseInt(e.target.value) || 180) * 1440})}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Min Power Pool ($)</label>
                      <input
                        type="number"
                        value={filters.minLP}
                        onChange={(e) => setFilters({...filters, minLP: parseInt(e.target.value) || 10000})}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Min Energy Surge (%)</label>
                      <input
                        type="number"
                        value={filters.minDeltaPct}
                        onChange={(e) => setFilters({...filters, minDeltaPct: parseInt(e.target.value) || 15})}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Min Price Flow 1h (%)</label>
                      <input
                        type="number"
                        value={filters.minPriceChangeH1}
                        onChange={(e) => setFilters({...filters, minPriceChangeH1: parseInt(e.target.value) || -5})}
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Realm Networks</label>
                      <input
                        type="text"
                        value={filters.networks}
                        onChange={(e) => setFilters({...filters, networks: e.target.value})}
                        placeholder="solana,base,ethereum"
                        className="w-full px-3 py-2 bg-gray-700/80 border border-gray-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Table - Full Width */}
            <div>
              {hasTableAccess ? (
                <div className="bg-gradient-to-r from-gray-800/95 to-gray-700/95 rounded-xl overflow-hidden table-enhanced border-glow-yellow relative z-10">
                  <div className="bg-gradient-to-r from-purple-800/80 to-yellow-800/80 px-4 py-2 border-b border-gray-600/50">
                    <h2 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
                      <Flame className="h-4 w-4 animate-pulse" />
                      Meme Entity Revelations
                      <Flame className="h-4 w-4 animate-pulse" />
                    </h2>
                    <p className="text-yellow-200/80 text-xs">Ancient wisdom meets fresh momentum</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-700/80 to-gray-600/80">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
                            <div className="flex items-center space-x-1">
                              <Zap className="h-3 w-3" />
                              <span>Score</span>
                            </div>
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Entity</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Realm</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Wisdom</span>
                            </div>
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Value</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Energy Flow</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Surge%</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Power Pool</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Activity</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Buy Force</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Price Flow</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">Portal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-600/50">
                        {filteredTokens.map((token, index) => (
                          <tr key={`${token.chainId}-${token.pairAddress}`} className="table-row-enhanced hover:bg-gray-700/50 transition-all duration-300">
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className={`text-lg font-bold ${getMemeScoreColor(token.score)}`}>
                                  {token.score}
                                </span>
                                <div className="text-xs text-gray-400">#{index + 1}</div>
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{token.token.symbol}</div>
                                <div className="text-xs text-gray-400 truncate max-w-32">{token.token.name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getChainColor(token.chainId)}`}>
                                {token.chainId}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className="text-white font-medium">{token.ageDays}d</div>
                                <div className="text-xs text-gray-400">{formatAge(token.ageMin)}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">
                                {token.priceUsd < 0.01 ? token.priceUsd.toExponential(2) : `$${token.priceUsd.toFixed(6)}`}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className="text-white">{formatNumber(token.vol5m)}</div>
                                <div className="text-gray-400">{formatNumber(token.vol1h)}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${getPriceChangeColor(token.dVolPct)}`}>
                                {token.dVolPct > 0 ? '+' : ''}{token.dVolPct}%
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{formatNumber(token.lp)}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{token.trades1h}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className={`font-medium ${token.buySkew5m >= 60 ? 'text-green-400' : token.buySkew5m >= 55 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                  {token.buySkew5m.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-400">Buy Force</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className={`font-medium ${getPriceChangeColor(token.priceChangeM5)}`}>
                                  5m: {token.priceChangeM5 > 0 ? '+' : ''}{token.priceChangeM5}%
                                </div>
                                <div className={`${getPriceChangeColor(token.priceChangeH1)}`}>
                                  1h: {token.priceChangeH1 > 0 ? '+' : ''}{token.priceChangeH1}%
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
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
                      <div className="text-gray-400 text-lg">No meme entities discovered</div>
                      <div className="text-sm text-gray-500 mt-2">
                        The meme multiverse is quiet. Adjust entity filters or await new revelations.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-gray-800/95 to-gray-700/95 rounded-xl overflow-hidden table-enhanced border border-red-500/50 relative z-10">
                  <div className="bg-gradient-to-r from-red-800/80 to-gray-800/80 px-4 py-2 border-b border-red-600/50">
                    <h2 className="text-lg font-bold text-red-300 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Premium Feature Locked
                      <Lock className="h-4 w-4" />
                    </h2>
                    <p className="text-red-200/80 text-xs">Connect wallet and hold 1,000+ tokens to unlock</p>
                  </div>
                  
                  <div className="text-center py-20">
                    <Lock className="h-20 w-20 text-red-400/50 mx-auto mb-6" />
                    <div className="text-red-300 text-xl font-bold mb-4">🔐 Table Access Restricted</div>
                    <div className="text-red-200/80 text-sm max-w-md mx-auto leading-relaxed mb-6">
                      This premium feature requires wallet connection and a minimum balance of 1,000 tokens 
                      of <code className="bg-gray-700 px-1 rounded text-xs">4dao...bonk</code> to access 
                      the advanced meme entity revelations table.
                    </div>
                    
                    {/* Inline Buy Button */}
                    <a
                      href="https://dexscreener.com/solana/2kv6hkaaij9vc7xhl8pfzxelcfekjw9o8zx3xl155gm3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Buy Tokens</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
