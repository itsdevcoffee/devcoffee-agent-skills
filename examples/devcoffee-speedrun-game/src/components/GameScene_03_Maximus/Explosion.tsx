import React from 'react';
import {ParticleEmitter} from '../shared/ParticleEmitter';
import {RETRO_COLORS} from '../../utils/retroColors';

interface ExplosionProps {
  x: number;
  y: number;
  startFrame: number;
  size?: 'small' | 'medium' | 'large';
}

export const Explosion: React.FC<ExplosionProps> = ({
  x,
  y,
  startFrame,
  size = 'medium',
}) => {
  const config = {
    small: {count: 15, duration: 15},
    medium: {count: 25, duration: 20},
    large: {count: 40, duration: 30},
  };

  const {count, duration} = config[size];

  return (
    <ParticleEmitter
      x={x}
      y={y}
      count={count}
      startFrame={startFrame}
      durationInFrames={duration}
      color={RETRO_COLORS.effects.explosion}
    />
  );
};
