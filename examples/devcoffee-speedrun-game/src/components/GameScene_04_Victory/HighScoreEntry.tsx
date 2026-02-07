import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {RetroText} from '../RetroEffects/RetroText';
import {RETRO_COLORS} from '../../utils/retroColors';

export const HighScoreEntry: React.FC = () => {
  const frame = useCurrentFrame();

  const startFrame = 0;
  const name = 'DEV';

  if (frame < startFrame) return null;

  const localFrame = frame - startFrame;

  // Typing effect
  const visibleChars = Math.min(Math.floor(localFrame / 8), name.length);
  const displayName = name.substring(0, visibleChars);

  // Cursor blink
  const cursorVisible = Math.floor(localFrame / 15) % 2 === 0;

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
        opacity,
      }}
    >
      {/* High score label */}
      <RetroText size={32} color={RETRO_COLORS.ui.cyan}>
        NEW HIGH SCORE!
      </RetroText>

      {/* Name entry */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <RetroText size={28} color={RETRO_COLORS.ui.white}>
          NAME:
        </RetroText>

        {/* Input boxes */}
        <div style={{display: 'flex', gap: 10}}>
          {Array.from({length: 3}).map((_, i) => (
            <div
              key={i}
              className="pixel-perfect"
              style={{
                width: 60,
                height: 80,
                border: `4px solid ${RETRO_COLORS.ui.white}`,
                backgroundColor: RETRO_COLORS.ui.black,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {i < visibleChars && (
                <RetroText size={48} color={RETRO_COLORS.ui.yellow}>
                  {name[i]}
                </RetroText>
              )}
              {i === visibleChars && cursorVisible && (
                <div
                  style={{
                    width: 40,
                    height: 6,
                    backgroundColor: RETRO_COLORS.ui.yellow,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instruction */}
      {visibleChars >= name.length && (
        <RetroText
          size={18}
          color={RETRO_COLORS.ui.white}
          blink
          blinkSpeed={20}
        >
          PRESS START TO CONTINUE
        </RetroText>
      )}
    </div>
  );
};
