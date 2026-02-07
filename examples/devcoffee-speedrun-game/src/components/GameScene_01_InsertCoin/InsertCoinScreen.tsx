import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {RetroText} from '../RetroEffects/RetroText';
import {RETRO_COLORS} from '../../utils/retroColors';

export const InsertCoinScreen: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: RETRO_COLORS.environment.sky,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 60,
      }}
    >
      {/* Game Title */}
      <div className="flex flex-col items-center gap-4">
        <RetroText size={72} color={RETRO_COLORS.ui.yellow} glow>
          DEVCOFFEE
        </RetroText>
        <RetroText size={48} color={RETRO_COLORS.ui.cyan}>
          SPEED RUN
        </RetroText>
      </div>

      {/* Blinking "INSERT COIN" */}
      <RetroText
        size={36}
        color={RETRO_COLORS.ui.white}
        blink
        blinkSpeed={30}
      >
        INSERT COIN
      </RetroText>

      {/* Credits */}
      {frame > 45 && (
        <div className="flex flex-col items-center gap-2">
          <RetroText size={18} color={RETRO_COLORS.ui.white}>
            1 PLAYER ONLY
          </RetroText>
          <RetroText size={18} color={RETRO_COLORS.ui.white}>
            CREDITS: 99
          </RetroText>
        </div>
      )}
    </AbsoluteFill>
  );
};
