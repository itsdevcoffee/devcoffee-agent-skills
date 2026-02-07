import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';
import {maximus, getCurrentFrame} from '../../data/spriteData';

interface MaximusShipProps {
  x: number;
  y: number;
  shooting?: boolean;
  powered?: boolean;
}

export const MaximusShip: React.FC<MaximusShipProps> = ({
  x,
  y,
  shooting = false,
  powered = false,
}) => {
  const frame = useCurrentFrame();

  // Get animation frame
  const animState = shooting ? 'shoot' : powered ? 'power' : 'idle';
  const animFrame = getCurrentFrame(frame, maximus[animState]);

  // Render ship sprite
  const color = RETRO_COLORS.maximus.primary;
  const highlight = RETRO_COLORS.maximus.highlight;
  const glow = RETRO_COLORS.effects.glow;

  // Pulse effect when powered
  const powerGlow = powered ? `0 0 20px ${glow}, 0 0 40px ${glow}` : 'none';

  return (
    <div
      className="pixel-perfect"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 48,
        height: 48,
        boxShadow: powerGlow,
      }}
    >
      {/* Ship body */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 18,
          width: 12,
          height: 24,
          backgroundColor: color,
        }}
      />

      {/* Cockpit */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          width: 8,
          height: 8,
          backgroundColor: highlight,
        }}
      />

      {/* Wings */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 8,
          width: 10,
          height: 8,
          backgroundColor: color,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 30,
          width: 10,
          height: 8,
          backgroundColor: color,
        }}
      />

      {/* Cannon (when shooting) */}
      {shooting && animFrame === 0 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 22,
              width: 4,
              height: 4,
              backgroundColor: RETRO_COLORS.ui.yellow,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: 23,
              width: 2,
              height: 4,
              backgroundColor: RETRO_COLORS.effects.explosion,
            }}
          />
        </>
      )}

      {/* Engine glow */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 20,
          width: 8,
          height: 6,
          backgroundColor: RETRO_COLORS.effects.explosion,
          opacity: 0.8,
        }}
      />
    </div>
  );
};
