import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {RETRO_COLORS} from '../../utils/retroColors';

interface PlatformProps {
  x: number;
  y: number;
  width: number;
  height: number;
  appearFrame?: number;
}

export const Platform: React.FC<PlatformProps> = ({
  x,
  y,
  width,
  height,
  appearFrame,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  let scale = 1;
  let opacity = 1;

  if (appearFrame !== undefined) {
    const localFrame = frame - appearFrame;

    if (localFrame < 0) {
      return null;
    }

    scale = spring({
      frame: localFrame,
      fps,
      config: {damping: 200, stiffness: 300},
    });

    opacity = Math.min(localFrame / 15, 1);
  }

  return (
    <div
      className="pixel-perfect"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: RETRO_COLORS.environment.platform,
        border: `4px solid ${RETRO_COLORS.environment.wall}`,
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: 'center center',
      }}
    >
      {/* Platform texture - horizontal lines */}
      {Array.from({length: Math.floor(height / 8)}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: i * 8,
            left: 0,
            width: '100%',
            height: 2,
            backgroundColor: RETRO_COLORS.environment.wall,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
};
