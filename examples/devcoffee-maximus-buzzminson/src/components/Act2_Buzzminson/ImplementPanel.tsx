import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {ProgressBar} from '../shared/ProgressBar';

export const ImplementPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = spring({
    frame,
    fps,
    config: {damping: 100, stiffness: 200},
  });

  return (
    <AbsoluteFill
      style={{opacity, transform: `scale(${scale})`}}
      className="flex flex-col items-center justify-center p-2"
    >
      <div style={{fontSize: 205}} className="mb-2">🔨</div>
      <h3 style={{fontSize: 96}} className="font-bold text-white mb-2">Implement</h3>
      <p className="text-purple-300 text-center mb-4 text-6xl">Build it completely</p>

      {/* Code blocks appearing */}
      <div className="w-full max-w-lg space-y-4">
        {[0, 1, 2].map((index) => {
          const blockStart = 20 + index * 10;
          const blockOpacity = interpolate(
            frame,
            [blockStart, blockStart + 10],
            [0, 1],
            {extrapolateRight: 'clamp'}
          );

          return (
            <div
              key={index}
              style={{opacity: blockOpacity}}
              className="bg-code-background h-16 rounded border border-purple-500"
            />
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg mt-6">
        <ProgressBar
          startFrame={20}
          endFrame={80}
          color="#a855f7"
          height={20}
        />
      </div>
    </AbsoluteFill>
  );
};
