import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

interface CounterProps {
  from: number;
  to: number;
  startFrame: number;
  endFrame: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  from,
  to,
  startFrame,
  endFrame,
  decimals = 0,
  suffix = '',
  prefix = '',
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [startFrame, endFrame],
    [from, to],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const formattedValue = value.toFixed(decimals);

  return (
    <span style={style} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};
