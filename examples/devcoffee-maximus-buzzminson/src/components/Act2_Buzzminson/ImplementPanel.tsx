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
      className="flex flex-col items-center justify-center p-8"
    >
      <div className="text-5xl mb-4">🔨</div>
      <h3 className="text-3xl font-bold text-white mb-4">Implement</h3>
      <p className="text-purple-300 text-center mb-6">Build it completely</p>

      {/* Code blocks appearing */}
      <div className="w-full max-w-sm space-y-2">
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
              className="bg-code-background h-8 rounded border border-purple-500"
            />
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mt-6">
        <ProgressBar
          startFrame={20}
          endFrame={80}
          color="#a855f7"
          height={6}
        />
      </div>
    </AbsoluteFill>
  );
};
