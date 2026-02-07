import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';

interface ComplexityBarrierProps {
  x: number;
  y: number;
  width: number;
  height: number;
  maxHp: number;
  currentHp: number;
  lastHitFrame?: number;
}

export const ComplexityBarrier: React.FC<ComplexityBarrierProps> = ({
  x,
  y,
  width,
  height,
  maxHp,
  currentHp,
  lastHitFrame,
}) => {
  const frame = useCurrentFrame();

  if (currentHp <= 0) {
    return null; // Destroyed
  }

  // Flash when hit
  const flashOpacity =
    lastHitFrame && frame - lastHitFrame < 5
      ? Math.floor((frame - lastHitFrame) / 2) % 2 === 0
        ? 1
        : 0.5
      : 1;

  // Damage cracks based on HP
  const damageLevel = 1 - currentHp / maxHp;

  return (
    <div
      className="pixel-perfect"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity: flashOpacity,
      }}
    >
      {/* Main barrier body */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: RETRO_COLORS.environment.wall,
          border: `4px solid ${RETRO_COLORS.ui.black}`,
          position: 'relative',
        }}
      >
        {/* Grid pattern */}
        {Array.from({length: Math.floor(height / 20)}).map((_, i) => (
          <div
            key={`h-${i}`}
            style={{
              position: 'absolute',
              top: i * 20,
              left: 0,
              width: '100%',
              height: 2,
              backgroundColor: RETRO_COLORS.ui.black,
              opacity: 0.5,
            }}
          />
        ))}

        {/* Damage cracks */}
        {damageLevel > 0.3 && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 10,
                width: 60,
                height: 3,
                backgroundColor: RETRO_COLORS.ui.red,
                transform: 'rotate(15deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 80,
                left: 30,
                width: 40,
                height: 3,
                backgroundColor: RETRO_COLORS.ui.red,
                transform: 'rotate(-20deg)',
              }}
            />
          </>
        )}

        {damageLevel > 0.6 && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 50,
                left: 20,
                width: 50,
                height: 3,
                backgroundColor: RETRO_COLORS.effects.explosion,
                transform: 'rotate(45deg)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 120,
                left: 15,
                width: 70,
                height: 3,
                backgroundColor: RETRO_COLORS.effects.explosion,
                transform: 'rotate(-30deg)',
              }}
            />
          </>
        )}

        {/* HP indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 4,
          }}
        >
          {Array.from({length: maxHp}).map((_, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                backgroundColor:
                  i < currentHp
                    ? RETRO_COLORS.ui.red
                    : RETRO_COLORS.ui.black,
                border: `2px solid ${RETRO_COLORS.ui.white}`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
