import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';

interface PowerUpProps {
  x: number;
  y: number;
  appearFrame: number;
  collected?: boolean;
  collectFrame?: number;
}

export const PowerUp: React.FC<PowerUpProps> = ({
  x,
  y,
  appearFrame,
  collected = false,
  collectFrame,
}) => {
  const frame = useCurrentFrame();

  if (frame < appearFrame) return null;

  if (collected && collectFrame !== undefined) {
    const localFrame = frame - collectFrame;
    if (localFrame > 12) return null;

    const scale = interpolate(localFrame, [0, 12], [1, 2], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const opacity = interpolate(localFrame, [0, 12], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {renderPowerUp()}
      </div>
    );
  }

  // Bob animation
  const bobOffset = Math.sin((frame - appearFrame) * 0.2) * 4;

  // Pulse animation
  const pulseScale = 1 + Math.sin((frame - appearFrame) * 0.3) * 0.1;

  return (
    <div
      className="pixel-perfect"
      style={{
        position: 'absolute',
        left: x,
        top: y + bobOffset,
        transform: `scale(${pulseScale})`,
      }}
    >
      {renderPowerUp()}
    </div>
  );
};

function renderPowerUp(): React.ReactNode {
  const color = RETRO_COLORS.collectibles.powerup;

  return (
    <div
      className="pixel-perfect"
      style={{
        width: 40,
        height: 40,
        position: 'relative',
      }}
    >
      {/* Star shape */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 12,
          width: 16,
          height: 8,
          backgroundColor: color,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          width: 8,
          height: 16,
          backgroundColor: color,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          width: 12,
          height: 12,
          backgroundColor: color,
          transform: 'rotate(45deg)',
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          backgroundColor: color,
          opacity: 0.3,
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
}
