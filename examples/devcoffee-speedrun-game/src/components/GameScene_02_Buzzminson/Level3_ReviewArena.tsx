import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PlayerCharacter} from './PlayerCharacter';
import {Platform} from './Platform';
import {Enemy} from './Enemy';
import {level3Data} from '../../data/gameData';
import {RETRO_COLORS} from '../../utils/retroColors';
import {RetroText} from '../RetroEffects/RetroText';

export const Level3_ReviewArena: React.FC = () => {
  const frame = useCurrentFrame();

  // Player movement across arena
  const playerX = interpolate(frame, [0, 150], [50, 1850], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine player state
  const getPlayerState = (): {y: number; state: 'idle' | 'walk' | 'attack'} => {
    // Attack enemies at specific frames
    if (frame >= 35 && frame < 40) return {y: 800, state: 'attack'}; // Enemy 1
    if (frame >= 70 && frame < 75) return {y: 800, state: 'attack'}; // Enemy 2
    if (frame >= 105 && frame < 110) return {y: 800, state: 'attack'}; // Enemy 3
    if (frame >= 130 && frame < 135) return {y: 800, state: 'attack'}; // Enemy 4
    return {y: 800, state: 'walk'};
  };

  const {y: playerY, state: playerState} = getPlayerState();

  // Track defeated enemies
  const defeated = [
    {id: 1, frame: 37},
    {id: 2, frame: 72},
    {id: 3, frame: 107},
    {id: 4, frame: 132},
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
        <RetroText size={36} color={RETRO_COLORS.ui.red} glow>
          LEVEL 3: REVIEW ARENA
        </RetroText>
      </div>

      {/* Platforms */}
      {level3Data.platforms.map((platform, i) => (
        <Platform
          key={i}
          x={platform.x}
          y={platform.y}
          width={platform.width}
          height={platform.height}
        />
      ))}

      {/* Enemies */}
      {level3Data.enemies?.map((enemy) => {
        const defeatData = defeated.find((d) => d.id === enemy.id);
        return (
          <Enemy
            key={enemy.id}
            x={enemy.x}
            y={enemy.y}
            patrolStart={enemy.patrolStart}
            patrolEnd={enemy.patrolEnd}
            defeated={defeatData ? frame >= defeatData.frame : false}
            defeatedFrame={defeatData?.frame}
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
