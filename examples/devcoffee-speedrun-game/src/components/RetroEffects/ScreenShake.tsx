import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

interface ScreenShakeProps {
  children: React.ReactNode;
  triggerFrame?: number;
  intensity?: number;
  durationInFrames?: number;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({
  children,
  triggerFrame,
  intensity = 8,
  durationInFrames = 6,
}) => {
  const frame = useCurrentFrame();

  let offsetX = 0;
  let offsetY = 0;

  if (triggerFrame !== undefined) {
    const localFrame = frame - triggerFrame;

    if (localFrame >= 0 && localFrame < durationInFrames) {
      const shakeAmount = interpolate(
        localFrame,
        [0, durationInFrames],
        [intensity, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      );

      // Pseudo-random shake pattern
      offsetX = (Math.sin(localFrame * 2.5) * shakeAmount);
      offsetY = (Math.cos(localFrame * 3.2) * shakeAmount);
    }
  }

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
