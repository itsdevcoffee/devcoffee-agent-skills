import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';
import {buzzminson, getCurrentFrame} from '../../data/spriteData';

interface PlayerCharacterProps {
  x: number;
  y: number;
  state: 'idle' | 'walk' | 'jump' | 'attack';
  facingRight?: boolean;
  startFrame?: number;
}

export const PlayerCharacter: React.FC<PlayerCharacterProps> = ({
  x,
  y,
  state,
  facingRight = true,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  // Get current animation frame
  const animFrame = getCurrentFrame(localFrame, buzzminson[state]);

  // Render character using CSS divs (32x32 pixel grid)
  const renderSprite = () => {
    const color = RETRO_COLORS.buzzminson.primary;
    const highlight = RETRO_COLORS.buzzminson.highlight;
    const shadow = RETRO_COLORS.buzzminson.secondary;

    // Walk animation: leg offset
    const walkOffset = state === 'walk' ? (animFrame % 2 === 0 ? 2 : -2) : 0;

    // Jump animation: compress/extend
    const jumpScale = state === 'jump' ? (animFrame === 1 ? 0.9 : 1) : 1;

    return (
      <div
        className="pixel-perfect"
        style={{
          width: 32,
          height: 32,
          position: 'relative',
          transform: `scaleY(${jumpScale})`,
        }}
      >
        {/* Head */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 12,
            width: 8,
            height: 8,
            backgroundColor: highlight,
          }}
        />

        {/* Body */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 10,
            width: 12,
            height: 8,
            backgroundColor: color,
          }}
        />

        {/* Arms */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 8,
            width: 4,
            height: 6,
            backgroundColor: color,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 20,
            width: 4,
            height: 6,
            backgroundColor: color,
          }}
        />

        {/* Legs - animated for walk */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 10 + walkOffset,
            width: 4,
            height: 8,
            backgroundColor: shadow,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 18 - walkOffset,
            width: 4,
            height: 8,
            backgroundColor: shadow,
          }}
        />

        {/* Attack effect */}
        {state === 'attack' && animFrame < 2 && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: facingRight ? 24 : -8,
              width: 8,
              height: 4,
              backgroundColor: RETRO_COLORS.effects.glow,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)',
      }}
    >
      {renderSprite()}
    </div>
  );
};
