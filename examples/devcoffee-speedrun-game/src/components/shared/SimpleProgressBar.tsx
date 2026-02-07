import React from 'react';

interface SimpleProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
}

export const SimpleProgressBar: React.FC<SimpleProgressBarProps> = ({
  progress,
  height = 24,
  backgroundColor = '#000000',
  fillColor = '#DC143C',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${clampedProgress}%`,
          height: '100%',
          backgroundColor: fillColor,
          transition: 'width 0.2s ease',
        }}
      />
    </div>
  );
};
