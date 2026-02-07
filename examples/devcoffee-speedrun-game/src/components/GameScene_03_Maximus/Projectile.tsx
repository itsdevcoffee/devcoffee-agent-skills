import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';

interface ProjectileProps {
  startX: number;
  startY: number;
  startFrame: number;
  speed?: number;
  color?: string;
}

export const Projectile: React.FC<ProjectileProps> = ({
  startX,
  startY,
  startFrame,
  speed = 12,
  color = RETRO_COLORS.ui.yellow,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > 90) {
    return null; // Not active yet or off screen
  }

  const currentY = startY - localFrame * speed;

  if (currentY < -50) {
    return null; // Off screen
  }

  return (
    <div
      className="pixel-perfect"
      style={{
        position: 'absolute',
        left: startX,
        top: currentY,
        width: 6,
        height: 16,
        backgroundColor: color,
        boxShadow: `0 0 12px ${color}`,
      }}
    >
      {/* Projectile tip */}
      <div
        style={{
          position: 'absolute',
          top: -4,
          left: 1,
          width: 4,
          height: 4,
          backgroundColor: RETRO_COLORS.ui.white,
        }}
      />
    </div>
  );
};
