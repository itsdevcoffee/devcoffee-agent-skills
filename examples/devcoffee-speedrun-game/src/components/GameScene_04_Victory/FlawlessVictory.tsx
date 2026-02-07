import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {RetroText} from '../RetroEffects/RetroText';
import {RETRO_COLORS} from '../../utils/retroColors';
import {ParticleEmitter} from '../shared/ParticleEmitter';

export const FlawlessVictory: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const startFrame = 0;

  if (frame < startFrame) return null;

  const localFrame = frame - startFrame;

  // Zoom in effect
  const scale = spring({
    frame: localFrame,
    fps,
    config: {damping: 100, stiffness: 200},
    from: 0.5,
    to: 1,
  });

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse effect
  const pulse = 1 + Math.sin(localFrame * 0.3) * 0.05;

  return (
    <div
      style={{
        position: 'relative',
        transform: `scale(${scale * pulse})`,
        opacity,
      }}
    >
      {/* Main text */}
      <RetroText size={72} color={RETRO_COLORS.ui.yellow} glow>
        FLAWLESS VICTORY
      </RetroText>

      {/* Celebration particles */}
      {localFrame > 10 && (
        <>
          <ParticleEmitter
            x={-100}
            y={0}
            count={30}
            startFrame={startFrame + 10}
            durationInFrames={40}
            color={RETRO_COLORS.ui.yellow}
          />
          <ParticleEmitter
            x={600}
            y={0}
            count={30}
            startFrame={startFrame + 10}
            durationInFrames={40}
            color={RETRO_COLORS.ui.cyan}
          />
        </>
      )}
    </div>
  );
};
