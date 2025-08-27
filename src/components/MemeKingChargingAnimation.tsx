'use client';

import { useEffect, useState } from 'react';
import { Crown, Zap, Star } from 'lucide-react';
import Image from 'next/image';

interface MemeKingChargingAnimationProps {
  isVisible: boolean;
  progress?: number;
  message?: string;
}

export default function MemeKingChargingAnimation({ 
  isVisible, 
  progress = 0, 
  message = "Charging Meme King Power..." 
}: MemeKingChargingAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number; rotation: number; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate random sparkles
      const newSparkles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3
      }));
      setSparkles(newSparkles);

      // Generate floating coins
      const newCoins = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        rotation: Math.random() * 360,
        delay: Math.random() * 2
      }));
      setCoins(newCoins);

      // Animation frame cycling
      const frameInterval = setInterval(() => {
        setCurrentFrame(() => {
          if (progress < 25) return 1; // วิ่ง
          if (progress < 50) return 2; // วิ่งต่อ
          if (progress < 75) return 3; // ล่ื่นล้ม
          if (progress < 100) return 4; // ตาย
          return 1; // กลับมาวิ่งใหม่
        });
      }, 500);

      return () => clearInterval(frameInterval);
    }
  }, [isVisible, progress]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-900/90 via-black/95 to-yellow-800/90 backdrop-blur-sm">
      {/* Background Golden Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
              boxShadow: '0 0 10px #fcd34d, 0 0 20px #f59e0b, 0 0 30px #d97706',
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* Floating Coins */}
      <div className="absolute inset-0 overflow-hidden">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="absolute animate-float-coin"
            style={{
              left: `${coin.x}%`,
              top: `${coin.y}%`,
              animationDelay: `${coin.delay}s`,
              transform: `rotate(${coin.rotation}deg)`
            }}
          >
            <Image
              src="/coin1.png"
              alt="Coin"
              width={40}
              height={40}
              className="drop-shadow-lg opacity-80"
            />
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <Image
              src="/Logo.jpg"
              alt="Meme King Logo"
              width={120}
              height={120}
              className="rounded-full border-4 border-yellow-400 shadow-2xl animate-pulse"
              style={{
                boxShadow: '0 0 40px rgba(251, 191, 36, 0.8), 0 0 80px rgba(245, 158, 11, 0.6), 0 0 120px rgba(217, 119, 6, 0.4)'
              }}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-spin-slow"></div>
          </div>
        </div>

        {/* Animated Character */}
        <div className="mb-8">
          <div className="relative inline-block">
            <Image
              src={`/animateframe/${currentFrame}.png`}
              alt="Meme Character"
              width={200}
              height={200}
              className="drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))'
              }}
            />
            
            {/* Character Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-yellow-300/20 to-yellow-400/10 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="relative w-80 h-80 mx-auto mb-8">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-600/30"></div>
          
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(251, 191, 36, 0.2)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-500 ease-out"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))'
              }}
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>

          {/* Lightning Bolts */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-gradient-to-t from-yellow-300 to-transparent animate-lightning-pulse"
              style={{
                height: '80px',
                left: '50%',
                top: '50%',
                transformOrigin: 'bottom center',
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                animationDelay: `${i * 0.1}s`,
                boxShadow: '0 0 15px #fcd34d, 0 0 30px #f59e0b'
              }}
            />
          ))}
        </div>

        {/* Progress Text */}
        <div className="text-center">
          <div className="text-yellow-200 font-bold text-2xl mb-3 animate-pulse">
            {message}
          </div>
          <div className="text-yellow-300/90 text-lg font-semibold mb-2">
            {progress}% Complete
          </div>
          <div className="text-yellow-400/70 text-sm">
            Building your meme empire...
          </div>
        </div>

        {/* Power Indicators */}
        <div className="flex justify-center space-x-8 mt-8">
          <div className="text-center">
            <Crown className="w-8 h-8 text-yellow-300 mx-auto mb-2 animate-bounce" />
            <div className="text-yellow-200 text-sm font-medium">POWER</div>
          </div>
          <div className="text-center">
            <Zap className="w-8 h-8 text-yellow-300 mx-auto mb-2 animate-pulse" />
            <div className="text-yellow-200 text-sm font-medium">ENERGY</div>
          </div>
          <div className="text-center">
            <Star className="w-8 h-8 text-yellow-300 mx-auto mb-2 animate-spin" />
            <div className="text-yellow-200 text-sm font-medium">WEALTH</div>
          </div>
        </div>
      </div>

      {/* Bottom Golden Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-40 bg-gradient-to-t from-yellow-600/30 via-yellow-500/10 to-transparent blur-3xl"></div>
    </div>
  );
}
