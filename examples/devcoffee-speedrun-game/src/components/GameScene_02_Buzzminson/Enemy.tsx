import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';
import {codeSmell, getCurrentFrame} from '../../data/spriteData';
import {ParticleEmitter} from '../shared/ParticleEmitter';

interface EnemyProps {
  x: number;
  y: number;
  patrolStart?: number;
  patrolEnd?: number;
  defeated?: boolean;
  defeatedFrame?: number;
}

export const Enemy: React.FC<EnemyProps> = ({
  x,
  y,
  patrolStart = 0,
  patrolEnd = 100,
  defeated = false,
  defeatedFrame,
}) => {
  const frame = useCurrentFrame();

  if (defeated && defeatedFrame !== undefined) {
    const localFrame = frame - defeatedFrame;

    if (localFrame > 20) {
      return null; // Fully defeated
    }

    // Defeat animation
    const opacity = interpolate(localFrame, [0, 20], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return (
      <>
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            opacity,
            transform: 'rotate(90deg)',
          }}
        >
          {renderEnemySprite(frame)}
        </div>
        <ParticleEmitter
          x={x + 16}
          y={y + 16}
          count={30}
          startFrame={defeatedFrame}
          durationInFrames={20}
          color={RETRO_COLORS.enemies.smell}
        />
      </>
    );
  }

  // Patrol movement
  const patrolRange = patrolEnd - patrolStart;
  const patrolProgress = ((frame % 120) / 120) * patrolRange;
  const currentX = patrolStart + patrolProgress;

  return (
    <div
      className="pixel-perfect"
      style={{
        position: 'absolute',
        left: currentX,
        top: y,
      }}
    >
      {renderEnemySprite(frame)}
    </div>
  );
};

function renderEnemySprite(frame: number): React.ReactNode {
  const animFrame = getCurrentFrame(frame, codeSmell.walk);
  const color = RETRO_COLORS.enemies.smell;

  // Walk animation: shift legs
  const legOffset = animFrame === 0 ? 0 : 2;

  return (
    <div
      className="pixel-perfect"
      style={{
        width: 32,
        height: 32,
        position: 'relative',
      }}
    >
      {/* Body - cloud shape */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 6,
          width: 20,
          height: 14,
          backgroundColor: color,
          borderRadius: '50%',
        }}
      />

      {/* Eyes */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 10,
          width: 4,
          height: 4,
          backgroundColor: RETRO_COLORS.ui.red,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 18,
          width: 4,
          height: 4,
          backgroundColor: RETRO_COLORS.ui.red,
        }}
      />

      {/* Legs */}
      <div
        style={{
          position: 'absolute',
          top: 22,
          left: 10 - legOffset,
          width: 3,
          height: 6,
          backgroundColor: color,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 22,
          left: 19 + legOffset,
          width: 3,
          height: 6,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
