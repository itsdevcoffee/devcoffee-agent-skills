import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';

interface ComboMeterProps {
  combo: number;
  multiplier: number;
  lastHitFrame?: number;
}

export const ComboMeter: React.FC<ComboMeterProps> = ({
  combo,
  multiplier,
  lastHitFrame,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (combo === 0) {
    return null;
  }

  const timeSinceHit = lastHitFrame ? frame - lastHitFrame : 999;
  const isRecent = timeSinceHit < 15;

  const scale = isRecent
    ? spring({
        frame: timeSinceHit,
        fps,
        config: {damping: 200, stiffness: 300},
        from: 1.5,
        to: 1,
      })
    : 1;

  const opacity = interpolate(timeSinceHit, [60, 90], [1, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const comboColor =
    combo >= 5
      ? RETRO_COLORS.effects.explosion
      : combo >= 3
        ? RETRO_COLORS.ui.orange
        : RETRO_COLORS.ui.yellow;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div
        className="text-pixel pixel-shadow"
        style={{
          fontSize: 48,
          color: comboColor,
          textShadow: `0 0 16px ${comboColor}, 0 0 32px ${comboColor}, 2px 2px 0 rgba(0, 0, 0, 0.8)`,
        }}
      >
        {combo} COMBO!
      </div>
      <div
        className="text-pixel pixel-shadow text-center"
        style={{
          fontSize: 24,
          color: RETRO_COLORS.ui.white,
          marginTop: -8,
        }}
      >
        {multiplier.toFixed(1)}x MULTIPLIER
      </div>
    </div>
  );
};
