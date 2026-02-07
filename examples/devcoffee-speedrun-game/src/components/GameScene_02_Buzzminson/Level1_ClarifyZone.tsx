import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PlayerCharacter} from './PlayerCharacter';
import {Platform} from './Platform';
import {Collectible} from './Collectible';
import {level1Data} from '../../data/gameData';
import {RETRO_COLORS} from '../../utils/retroColors';
import {RetroText} from '../RetroEffects/RetroText';

export const Level1_ClarifyZone: React.FC = () => {
  const frame = useCurrentFrame();

  // Player movement (150 frames total)
  const playerX = interpolate(frame, [0, 150], [50, 1600], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine player state and Y position based on progression
  const getPlayerState = (): {y: number; state: 'idle' | 'walk' | 'jump'} => {
    if (frame < 30) return {y: 800, state: 'walk'};
    if (frame < 45) return {y: 650, state: 'jump'}; // Jump to platform 1
    if (frame < 60) return {y: 800, state: 'walk'};
    if (frame < 75) return {y: 550, state: 'jump'}; // Jump to platform 2
    if (frame < 90) return {y: 700, state: 'walk'};
    if (frame < 105) return {y: 650, state: 'jump'}; // Jump to platform 3
    if (frame < 120) return {y: 800, state: 'walk'};
    if (frame < 135) return {y: 750, state: 'walk'};
    return {y: 800, state: 'walk'};
  };

  const {y: playerY, state: playerState} = getPlayerState();

  // Track collected items
  const collected = [
    {id: 1, frame: 30},
    {id: 2, frame: 60},
    {id: 3, frame: 90},
    {id: 4, frame: 105},
    {id: 5, frame: 135},
  ];

  // Level title
  const titleOpacity = interpolate(frame, [0, 15, 135, 150], [0, 1, 1, 0], {
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
        <RetroText size={36} color={RETRO_COLORS.ui.yellow} glow>
          LEVEL 1: CLARIFY ZONE
        </RetroText>
      </div>

      {/* Platforms */}
      {level1Data.platforms.map((platform, i) => (
        <Platform
          key={i}
          x={platform.x}
          y={platform.y}
          width={platform.width}
          height={platform.height}
        />
      ))}

      {/* Collectibles */}
      {level1Data.collectibles.map((item) => {
        const collectData = collected.find((c) => c.id === item.id);
        return (
          <Collectible
            key={item.id}
            x={item.x}
            y={item.y}
            type={item.type}
            collected={collectData ? frame >= collectData.frame : false}
            collectFrame={collectData?.frame}
          />
        );
      })}

      {/* Player */}
      <PlayerCharacter
        x={playerX}
        y={playerY}
        state={playerState}
        facingRight={true}
      />
    </AbsoluteFill>
  );
};
