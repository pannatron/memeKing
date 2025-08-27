'use client';

import { useEffect, useState } from 'react';
import { Zap, Crown, Star } from 'lucide-react';

interface GoldenChargingAnimationProps {
  isVisible: boolean;
  progress?: number;
  message?: string;
}

export default function GoldenChargingAnimation({ 
  isVisible, 
  progress = 0, 
  message = "Charging Power..." 
}: GoldenChargingAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate random sparkles
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setSparkles(newSparkles);

      // Animation phase cycling
      const interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Background Golden Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
              boxShadow: '0 0 6px #fbbf24, 0 0 12px #f59e0b, 0 0 18px #d97706'
            }}
          />
        ))}
      </div>

      {/* Main Charging Container */}
      <div className="relative">
        {/* Outer Golden Ring */}
        <div className="relative w-64 h-64 rounded-full border-4 border-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 animate-spin-slow">
          <div className="absolute inset-2 rounded-full border-2 border-yellow-500/50 animate-pulse">
            
            {/* Inner Energy Core */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 animate-pulse shadow-2xl">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-spin"></div>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {animationPhase === 0 && <Crown className="w-16 h-16 text-yellow-200 animate-bounce" />}
                  {animationPhase === 1 && <Zap className="w-16 h-16 text-yellow-200 animate-pulse" />}
                  {animationPhase === 2 && <Star className="w-16 h-16 text-yellow-200 animate-spin" />}
                  {animationPhase === 3 && <Crown className="w-16 h-16 text-yellow-200 animate-pulse" />}
                  
                  {/* Icon Glow Effect */}
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightning Bolts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 bg-gradient-to-b from-yellow-300 to-transparent animate-pulse"
              style={{
                height: '60px',
                left: '50%',
                top: '50%',
                transformOrigin: 'bottom center',
                transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.2}s`,
                boxShadow: '0 0 10px #fbbf24, 0 0 20px #f59e0b'
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-80">
          <div className="bg-gray-800/80 rounded-full h-3 overflow-hidden border border-yellow-600/50">
            <div 
              className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-300 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Progress Text */}
          <div className="text-center mt-4">
            <div className="text-yellow-300 font-bold text-xl mb-2 animate-pulse">
              {message}
            </div>
            <div className="text-yellow-400/80 text-sm">
              {progress}% Complete
            </div>
          </div>
        </div>

        {/* Floating Energy Orbs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-float"
            style={{
              left: `${50 + Math.cos((i * Math.PI * 2) / 6) * 150}px`,
              top: `${50 + Math.sin((i * Math.PI * 2) / 6) * 150}px`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: '0 0 15px #fbbf24, 0 0 30px #f59e0b',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-yellow-600/20 to-transparent blur-3xl"></div>
    </div>
  );
}
