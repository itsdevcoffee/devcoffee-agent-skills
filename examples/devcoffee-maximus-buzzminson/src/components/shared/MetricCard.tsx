import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {Counter} from './Counter';

interface MetricCardProps {
  label: string;
  value: number;
  startValue?: number;
  unit?: string;
  startFrame: number;
  endFrame: number;
  color?: string;
  icon?: string;
  style?: React.CSSProperties;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  startValue = 0,
  unit = '',
  startFrame,
  endFrame,
  color = '#10b981',
  icon = '',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

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
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
      className="bg-gray-800 bg-opacity-80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-2xl uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-4xl">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <Counter
          from={startValue}
          to={value}
          startFrame={startFrame}
          endFrame={endFrame}
          className="text-7xl font-bold"
          style={{color}}
          suffix={unit}
        />
      </div>
    </div>
  );
};
