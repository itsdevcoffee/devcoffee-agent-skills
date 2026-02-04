import React from 'react';
import {useCurrentFrame, interpolate, random} from 'remotion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface ParticleEmitterProps {
  particleCount: number;
  color?: string;
  startFrame: number;
  duration: number;
  emitX: number;
  emitY: number;
  style?: React.CSSProperties;
}

export const ParticleEmitter: React.FC<ParticleEmitterProps> = ({
  particleCount,
  color = '#ef4444',
  startFrame,
  duration,
  emitX,
  emitY,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > duration) {
    return null;
  }

  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    const seed = i * 1000;
    const angle = random(seed) * Math.PI * 2;
    const speed = 2 + random(seed + 1) * 3;

    particles.push({
      id: i,
      x: emitX + Math.cos(angle) * localFrame * speed,
      y: emitY + Math.sin(angle) * localFrame * speed + (localFrame * localFrame * 0.1),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + random(seed + 2) * 4,
      color,
    });
  }

  return (
    <div style={{position: 'absolute', inset: 0, ...style}}>
      {particles.map((particle) => {
        const opacity = interpolate(
          localFrame,
          [0, duration * 0.5, duration],
          [0, 1, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );

        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particle.color,
              opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        );
      })}
    </div>
  );
};
