import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PlayerCharacter} from './PlayerCharacter';
import {Platform} from './Platform';
import {level4Data} from '../../data/gameData';
import {RETRO_COLORS} from '../../utils/retroColors';
import {RetroText} from '../RetroEffects/RetroText';
import {ParticleEmitter} from '../shared/ParticleEmitter';
import {PixelTransition} from '../RetroEffects/PixelTransition';

export const Level4_BossHandoff: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Player movement - approach boss
  const playerX = interpolate(frame, [0, 50], [50, 400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Boss HP (starts at 3)
  const bossHP = frame < 60 ? 3 : frame < 90 ? 2 : frame < 120 ? 1 : 0;

  // Boss shake when hit
  const bossShakeX =
    (frame === 60 || frame === 90 || frame === 120) ?
      (Math.sin(frame * 4) * 8) : 0;

  // Boss defeated animation
  const bossOpacity = bossHP === 0 ?
    interpolate(frame, [120, 145], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) : 1;

  // Player state
  const getPlayerState = (): {y: number; state: 'idle' | 'walk' | 'attack'} => {
    if (frame >= 58 && frame < 62) return {y: 800, state: 'attack'};
    if (frame >= 88 && frame < 92) return {y: 800, state: 'attack'};
    if (frame >= 118 && frame < 122) return {y: 800, state: 'attack'};
    if (frame < 50) return {y: 800, state: 'walk'};
    return {y: 800, state: 'idle'};
  };

  const {y: playerY, state: playerState} = getPlayerState();

  // "HANDOFF TO MAXIMUS" text
  const handoffOpacity = interpolate(frame, [125, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const handoffScale = spring({
    frame: frame - 125,
    fps,
    config: {damping: 200, stiffness: 300},
  });

  // Level title
  const titleOpacity = interpolate(frame, [0, 15, 50, 65], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: RETRO_COLORS.environment.sky}}>
      {/* Level title */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: titleOpacity,
        }}
      >
        <RetroText size={36} color={RETRO_COLORS.ui.orange} glow>
          LEVEL 4: BOSS BATTLE
        </RetroText>
      </div>

      {/* Platforms */}
      {level4Data.platforms.map((platform, i) => (
        <Platform
          key={i}
          x={platform.x}
          y={platform.y}
          width={platform.width}
          height={platform.height}
        />
      ))}

      {/* Boss - Monolith */}
      {bossHP > 0 && (
        <div
          className="pixel-perfect"
          style={{
            position: 'absolute',
            left: 960 + bossShakeX,
            top: 500,
            opacity: bossOpacity,
          }}
        >
          <div
            style={{
              width: 120,
              height: 300,
              backgroundColor: RETRO_COLORS.enemies.boss,
              border: `6px solid ${RETRO_COLORS.ui.black}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {/* Boss face */}
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: RETRO_COLORS.ui.red,
                border: `4px solid ${RETRO_COLORS.ui.black}`,
              }}
            />
            {/* HP bars */}
            {Array.from({length: bossHP}).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 80,
                  height: 12,
                  backgroundColor: RETRO_COLORS.ui.red,
                  border: `2px solid ${RETRO_COLORS.ui.white}`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Boss defeat particles */}
      {bossHP === 0 && frame >= 120 && (
        <ParticleEmitter
          x={1020}
          y={650}
          count={50}
          startFrame={120}
          durationInFrames={30}
          color={RETRO_COLORS.enemies.boss}
        />
      )}

      {/* Player */}
      <PlayerCharacter
        x={playerX}
        y={playerY}
        state={playerState}
        facingRight={true}
      />

      {/* Handoff message */}
      {frame >= 125 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${handoffScale})`,
            opacity: handoffOpacity,
          }}
        >
          <RetroText size={64} color={RETRO_COLORS.maximus.primary} glow>
            HANDOFF TO MAXIMUS!
          </RetroText>
        </div>
      )}

      {/* Transition out */}
      <PixelTransition
        startFrame={140}
        durationInFrames={10}
        type="fade"
        color={RETRO_COLORS.ui.black}
      />
    </AbsoluteFill>
  );
};
