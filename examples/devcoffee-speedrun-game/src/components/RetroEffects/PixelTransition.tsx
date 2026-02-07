import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

interface PixelTransitionProps {
  startFrame: number;
  durationInFrames: number;
  type?: 'wipe-right' | 'wipe-down' | 'fade' | 'pixelate';
  color?: string;
}

export const PixelTransition: React.FC<PixelTransitionProps> = ({
  startFrame,
  durationInFrames,
  type = 'wipe-right',
  color = '#000000',
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > durationInFrames) {
    return null;
  }

  const progress = interpolate(localFrame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const renderTransition = () => {
    switch (type) {
      case 'wipe-right':
        return (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: `${progress * 100}%`,
              height: '100%',
              backgroundColor: color,
            }}
          />
        );

      case 'wipe-down':
        return (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: `${progress * 100}%`,
              backgroundColor: color,
            }}
          />
        );

      case 'fade':
        return (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              backgroundColor: color,
              opacity: progress,
            }}
          />
        );

      case 'pixelate':
        const pixelSize = Math.floor((1 - progress) * 32) + 1;
        return (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              backgroundColor: color,
              opacity: progress,
              backdropFilter: `blur(${pixelSize}px)`,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AbsoluteFill style={{zIndex: 8888}}>
      {renderTransition()}
    </AbsoluteFill>
  );
};
