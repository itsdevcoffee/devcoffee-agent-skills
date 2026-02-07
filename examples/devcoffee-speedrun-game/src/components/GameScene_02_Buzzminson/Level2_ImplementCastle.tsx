import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PlayerCharacter} from './PlayerCharacter';
import {Platform} from './Platform';
import {Collectible} from './Collectible';
import {level2Data, level2DynamicPlatforms} from '../../data/gameData';
import {RETRO_COLORS} from '../../utils/retroColors';
import {RetroText} from '../RetroEffects/RetroText';

export const Level2_ImplementCastle: React.FC = () => {
  const frame = useCurrentFrame();

  // Player movement
  const playerX = interpolate(frame, [0, 150], [50, 1600], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine player state and Y position
  const getPlayerState = (): {y: number; state: 'idle' | 'walk' | 'jump'} => {
    if (frame < 35) return {y: 800, state: 'walk'};
    if (frame < 50) return {y: 750, state: 'jump'}; // Jump to dynamic platform 1
    if (frame < 75) return {y: 700, state: 'walk'};
    if (frame < 90) return {y: 650, state: 'jump'}; // Jump to dynamic platform 2
    if (frame < 115) return {y: 750, state: 'walk'};
    if (frame < 130) return {y: 800, state: 'jump'}; // Jump to dynamic platform 3
    return {y: 800, state: 'walk'};
  };

  const {y: playerY, state: playerState} = getPlayerState();

  // Track collected items and platform appearances
  const collected = [
    {id: 1, frame: 35, platformIndex: 0},
    {id: 2, frame: 75, platformIndex: 1},
    {id: 3, frame: 115, platformIndex: 2},
    {id: 4, frame: 140, platformIndex: 3},
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
        <RetroText size={36} color={RETRO_COLORS.ui.cyan} glow>
          LEVEL 2: IMPLEMENT CASTLE
        </RetroText>
      </div>

      {/* Static platforms */}
      {level2Data.platforms.map((platform, i) => (
        <Platform
          key={`static-${i}`}
          x={platform.x}
          y={platform.y}
          width={platform.width}
          height={platform.height}
        />
      ))}

      {/* Dynamic platforms (appear when code blocks collected) */}
      {level2DynamicPlatforms.map((platform, i) => {
        const appearData = collected.find((c) => c.platformIndex === i);
        return (
          <Platform
            key={`dynamic-${i}`}
            x={platform.x}
            y={platform.y}
            width={platform.width}
            height={platform.height}
            appearFrame={appearData?.frame}
          />
        );
      })}

      {/* Collectibles (code blocks) */}
      {level2Data.collectibles.map((item) => {
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
