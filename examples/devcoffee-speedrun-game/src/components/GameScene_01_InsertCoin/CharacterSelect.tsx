import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {RetroText} from '../RetroEffects/RetroText';
import {RETRO_COLORS} from '../../utils/retroColors';

export const CharacterSelect: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const buzzmButtonScale = spring({
    frame: frame - 15,
    fps,
    config: {damping: 200, stiffness: 300},
  });

  const maximButtonScale = spring({
    frame: frame - 25,
    fps,
    config: {damping: 200, stiffness: 300},
  });

  // Cursor blinks on "TEAM UP" option
  const cursorOpacity = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  // Flash confirmation at end
  const flashOpacity = frame > 50 ? (Math.floor((frame - 50) / 3) % 2 === 0 ? 1 : 0) : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: RETRO_COLORS.environment.sky,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 80,
      }}
    >
      {/* Title */}
      <div style={{opacity: titleOpacity}}>
        <RetroText size={48} color={RETRO_COLORS.ui.yellow}>
          SELECT YOUR TEAM
        </RetroText>
      </div>

      {/* Character Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 60,
        }}
      >
        {/* Buzzminson */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            transform: `scale(${buzzmButtonScale})`,
          }}
        >
          <div
            className="pixel-perfect"
            style={{
              width: 200,
              height: 200,
              backgroundColor: RETRO_COLORS.buzzminson.primary,
              border: `6px solid ${RETRO_COLORS.ui.white}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <RetroText size={64} color={RETRO_COLORS.ui.white}>
              B
            </RetroText>
          </div>
          <RetroText size={24} color={RETRO_COLORS.buzzminson.highlight}>
            BUZZMINSON
          </RetroText>
          <RetroText size={14} color={RETRO_COLORS.ui.white}>
            ITERATIVE DEV
          </RetroText>
        </div>

        {/* Maximus */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            transform: `scale(${maximButtonScale})`,
          }}
        >
          <div
            className="pixel-perfect"
            style={{
              width: 200,
              height: 200,
              backgroundColor: RETRO_COLORS.maximus.primary,
              border: `6px solid ${RETRO_COLORS.ui.white}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <RetroText size={64} color={RETRO_COLORS.ui.white}>
              M
            </RetroText>
          </div>
          <RetroText size={24} color={RETRO_COLORS.maximus.highlight}>
            MAXIMUS
          </RetroText>
          <RetroText size={14} color={RETRO_COLORS.ui.white}>
            BUG HUNTER
          </RetroText>
        </div>
      </div>

      {/* Team Up Option */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginTop: 40,
        }}
      >
        <div style={{opacity: cursorOpacity}}>
          <RetroText size={32} color={RETRO_COLORS.ui.yellow}>
            &gt;
          </RetroText>
        </div>
        <RetroText size={32} color={RETRO_COLORS.ui.green}>
          TEAM UP MODE
        </RetroText>
      </div>

      {/* Flash overlay for confirmation */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: RETRO_COLORS.ui.white,
            opacity: flashOpacity * 0.7,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
