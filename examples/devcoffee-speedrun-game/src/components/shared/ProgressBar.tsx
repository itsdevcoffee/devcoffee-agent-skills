import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface ProgressBarProps {
  startFrame: number;
  endFrame: number;
  color?: string;
  height?: number;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  startFrame,
  endFrame,
  color = '#10b981',
  height = 8,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
    },
  });

  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: height / 2,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: height / 2,
          transform: `scaleY(${scale})`,
          transformOrigin: 'left',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
};
