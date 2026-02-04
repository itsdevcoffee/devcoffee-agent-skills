import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const ReviewPanel: React.FC = () => {
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

  // Circular arrow rotation for iteration
  const rotation = interpolate(frame, [20, 80], [0, 360], {
    extrapolateRight: 'extend',
  });

  return (
    <AbsoluteFill
      style={{opacity, transform: `scale(${scale})`}}
      className="flex flex-col items-center justify-center p-8"
    >
      <div className="text-5xl mb-4">🔄</div>
      <h3 className="text-3xl font-bold text-white mb-4">Review</h3>
      <p className="text-purple-300 text-center mb-6">Iterate until perfect</p>

      {/* Iteration loop visualization */}
      <div className="relative">
        <div
          style={{transform: `rotate(${rotation}deg)`}}
          className="text-6xl"
        >
          🔄
        </div>

        {/* User feedback bubble */}
        <div
          style={{
            opacity: interpolate(frame, [40, 55], [0, 1], {
              extrapolateRight: 'clamp',
            }),
          }}
          className="absolute -top-8 -right-12 bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
        >
          👤 Feedback
        </div>
      </div>
    </AbsoluteFill>
  );
};
