import React from 'react';
import {useCurrentFrame, interpolate, random} from 'remotion';

interface SteamParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export const CoffeeSteam: React.FC = () => {
  const frame = useCurrentFrame();

  // Generate steam particles
  const particles: SteamParticle[] = [];
  for (let i = 0; i < 8; i++) {
    particles.push({
      id: i,
      x: -20 + random(i * 100) * 40,
      y: 0,
      delay: random(i * 200) * 30,
    });
  }

  return (
    <div className="relative">
      {/* Coffee cup emoji */}
      <div className="text-8xl">☕</div>

      {/* Steam particles */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        {particles.map((particle) => {
          const localFrame = frame - particle.delay;

          if (localFrame < 0) return null;

          const y = interpolate(
            localFrame,
            [0, 60],
            [0, -100],
            {extrapolateRight: 'clamp'}
          );

          const opacity = interpolate(
            localFrame,
            [0, 20, 60],
            [0, 0.6, 0],
            {extrapolateRight: 'clamp'}
          );

          const scale = interpolate(
            localFrame,
            [0, 60],
            [0.5, 1.5],
            {extrapolateRight: 'clamp'}
          );

          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: particle.x,
                top: y,
                opacity,
                transform: `scale(${scale})`,
              }}
              className="w-4 h-4 bg-gray-400 rounded-full blur-sm"
            />
          );
        })}
      </div>
    </div>
  );
};
