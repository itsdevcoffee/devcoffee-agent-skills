import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

interface SimpleCounterProps {
  target: number;
  startFrame: number;
  durationInFrames: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export const SimpleCounter: React.FC<SimpleCounterProps> = ({
  target,
  startFrame,
  durationInFrames,
  decimals = 0,
  suffix = '',
  prefix = '',
}) => {
  const frame = useCurrentFrame();

  const endFrame = startFrame + durationInFrames;

  const value = interpolate(
    frame,
    [startFrame, endFrame],
    [0, target],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const formattedValue = Math.floor(value).toFixed(decimals);

  return (
    <>
      {prefix}
      {formattedValue}
      {suffix}
    </>
  );
};
