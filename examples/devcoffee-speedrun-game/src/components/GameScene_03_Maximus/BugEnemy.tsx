import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';
import {bug, getCurrentFrame} from '../../data/spriteData';

interface BugEnemyProps {
  x: number;
  y: number;
  pattern: 'straight' | 'zigzag' | 'circle';
  startFrame: number;
  exploded?: boolean;
  explodeFrame?: number;
}

export const BugEnemy: React.FC<BugEnemyProps> = ({
  x,
  y,
  pattern,
  startFrame,
  exploded = false,
  explodeFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  // Calculate position based on pattern
  let currentX = x;
  let currentY = y;

  if (!exploded) {
    switch (pattern) {
      case 'straight':
        currentY = y + localFrame * 4;
        break;
      case 'zigzag':
        currentY = y + localFrame * 4;
        currentX = x + Math.sin(localFrame * 0.2) * 60;
        break;
      case 'circle':
        currentY = y + localFrame * 3;
        currentX = x + Math.cos(localFrame * 0.15) * 80;
        break;
    }

    // Off screen?
    if (currentY > 1100) return null;
  }

  // Exploded animation
  if (exploded && explodeFrame !== undefined) {
    const explodeLocal = frame - explodeFrame;
    if (explodeLocal > 15) return null;

    const explodeOpacity = interpolate(explodeLocal, [0, 15], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          left: currentX,
          top: currentY,
          opacity: explodeOpacity,
        }}
      >
        {renderExplosion()}
      </div>
    );
  }

  // Fly animation
  const animFrame = getCurrentFrame(localFrame, bug.fly);

  return (
    <div
      className="pixel-perfect"
      style={{
        position: 'absolute',
        left: currentX,
        top: currentY,
      }}
    >
      {renderBug(animFrame)}
    </div>
  );
};

function renderBug(animFrame: number): React.ReactNode {
  const color = RETRO_COLORS.enemies.bug;
  const wingOffset = animFrame === 0 ? 0 : -2;

  return (
    <div
      className="pixel-perfect"
      style={{
        width: 32,
        height: 32,
        position: 'relative',
      }}
    >
      {/* Body */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          width: 8,
          height: 12,
          backgroundColor: color,
        }}
      />

      {/* Head */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 14,
          width: 4,
          height: 4,
          backgroundColor: color,
        }}
      />

      {/* Wings */}
      <div
        style={{
          position: 'absolute',
          top: 14 + wingOffset,
          left: 6,
          width: 6,
          height: 8,
          backgroundColor: RETRO_COLORS.ui.red,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 14 + wingOffset,
          left: 20,
          width: 6,
          height: 8,
          backgroundColor: RETRO_COLORS.ui.red,
          opacity: 0.7,
        }}
      />
    </div>
  );
}

function renderExplosion(): React.ReactNode {
  return (
    <div
      className="pixel-perfect"
      style={{
        width: 32,
        height: 32,
        backgroundColor: RETRO_COLORS.effects.explosion,
        borderRadius: '50%',
        boxShadow: `0 0 20px ${RETRO_COLORS.effects.explosion}`,
      }}
    />
  );
}
