import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';
import {collectible, getCurrentFrame} from '../../data/spriteData';
import {ParticleEmitter} from '../shared/ParticleEmitter';

interface CollectibleProps {
  x: number;
  y: number;
  type: 'question' | 'code' | 'powerup';
  collected?: boolean;
  collectFrame?: number;
}

export const Collectible: React.FC<CollectibleProps> = ({
  x,
  y,
  type,
  collected = false,
  collectFrame,
}) => {
  const frame = useCurrentFrame();

  if (collected && collectFrame !== undefined) {
    const localFrame = frame - collectFrame;

    if (localFrame > 15) {
      return null; // Fully collected
    }

    // Collect animation
    const scale = interpolate(localFrame, [0, 15], [1, 2], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    const opacity = interpolate(localFrame, [0, 15], [1, 0], {
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
            transform: `scale(${scale})`,
            opacity,
          }}
        >
          {renderIcon(type)}
        </div>
        <ParticleEmitter
          x={x + 16}
          y={y + 16}
          count={20}
          startFrame={collectFrame}
          durationInFrames={15}
          color={getColor(type)}
        />
      </>
    );
  }

  // Bob animation
  const animFrame = getCurrentFrame(frame, collectible.bob);
  const bobOffset = animFrame === 0 ? 0 : -4;

  return (
    <div
      className="pixel-perfect"
      style={{
        position: 'absolute',
        left: x,
        top: y + bobOffset,
      }}
    >
      {renderIcon(type)}
    </div>
  );
};

function renderIcon(type: 'question' | 'code' | 'powerup'): React.ReactNode {
  const color = getColor(type);

  return (
    <div
      className="pixel-perfect"
      style={{
        width: 32,
        height: 32,
        backgroundColor: color,
        border: `3px solid ${RETRO_COLORS.ui.white}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: `0 0 12px ${color}`,
      }}
    >
      <div
        className="text-pixel"
        style={{
          fontSize: 24,
          color: RETRO_COLORS.ui.white,
          lineHeight: '24px',
        }}
      >
        {type === 'question' ? '?' : type === 'code' ? '{}' : '*'}
      </div>
    </div>
  );
}

function getColor(type: 'question' | 'code' | 'powerup'): string {
  switch (type) {
    case 'question':
      return RETRO_COLORS.collectibles.question;
    case 'code':
      return RETRO_COLORS.collectibles.code;
    case 'powerup':
      return RETRO_COLORS.collectibles.powerup;
  }
}
