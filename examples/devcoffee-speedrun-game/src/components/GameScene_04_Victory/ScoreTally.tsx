import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SimpleCounter} from '../shared/SimpleCounter';
import {RETRO_COLORS} from '../../utils/retroColors';
import {FINAL_SCORES} from '../../data/scoreData';

export const ScoreTally: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lines = [
    {label: 'BUZZMINSON LEVELS', value: FINAL_SCORES.buzzminsonLevels, startFrame: 15},
    {label: 'MAXIMUS PHASES', value: FINAL_SCORES.maximusPhases, startFrame: 35},
    {label: 'COMBO BONUS', value: FINAL_SCORES.comboBonus, startFrame: 55},
    {label: 'NO HIT BONUS', value: FINAL_SCORES.noHitBonus, startFrame: 75},
    {label: 'TIME BONUS', value: FINAL_SCORES.timeBonus, startFrame: 95},
  ];

  const totalStartFrame = 115;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: 40,
      }}
    >
      {/* Score breakdown */}
      {lines.map((line, index) => {
        const opacity = interpolate(frame, [line.startFrame, line.startFrame + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const scale = spring({
          frame: frame - line.startFrame,
          fps,
          config: {damping: 200, stiffness: 300},
        });

        if (frame < line.startFrame) return null;

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            <div
              className="text-pixel pixel-shadow"
              style={{
                fontSize: 24,
                color: RETRO_COLORS.ui.white,
              }}
            >
              {line.label}
            </div>
            <div
              className="text-pixel pixel-shadow"
              style={{
                fontSize: 28,
                color: RETRO_COLORS.ui.yellow,
              }}
            >
              <SimpleCounter
                target={line.value}
                startFrame={line.startFrame}
                durationInFrames={20}
                prefix=""
                suffix=""
              />
            </div>
          </div>
        );
      })}

      {/* Divider */}
      {frame >= totalStartFrame - 5 && (
        <div
          style={{
            width: '100%',
            height: 4,
            backgroundColor: RETRO_COLORS.ui.white,
            marginTop: 10,
          }}
        />
      )}

      {/* Total */}
      {frame >= totalStartFrame && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: `scale(${spring({
              frame: frame - totalStartFrame,
              fps,
              config: {damping: 150, stiffness: 400},
            })})`,
          }}
        >
          <div
            className="text-pixel pixel-shadow"
            style={{
              fontSize: 36,
              color: RETRO_COLORS.ui.green,
            }}
          >
            TOTAL SCORE
          </div>
          <div
            className="text-pixel pixel-shadow"
            style={{
              fontSize: 48,
              color: RETRO_COLORS.ui.green,
              textShadow: `0 0 16px ${RETRO_COLORS.ui.green}, 0 0 32px ${RETRO_COLORS.ui.green}, 2px 2px 0 rgba(0, 0, 0, 0.8)`,
            }}
          >
            <SimpleCounter
              target={FINAL_SCORES.total}
              startFrame={totalStartFrame}
              durationInFrames={25}
              prefix=""
              suffix=""
            />
          </div>
        </div>
      )}
    </div>
  );
};
