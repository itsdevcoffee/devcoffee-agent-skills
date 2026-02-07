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
      className="flex flex-col items-center justify-center p-2"
    >
      <div style={{fontSize: 205}} className="mb-2">🔄</div>
      <h3 style={{fontSize: 96}} className="font-bold text-white mb-2">Review</h3>
      <p className="text-purple-300 text-center mb-4 text-6xl">Iterate until perfect</p>

      {/* Iteration loop with feedback bubble side by side */}
      <div className="flex items-center gap-8">
        <div
          style={{fontSize: 115, transform: `rotate(${rotation}deg)`}}
        >
          🔄
        </div>

        {/* User feedback bubble - positioned beside the spinning icon */}
        <div
          style={{
            opacity: interpolate(frame, [40, 55], [0, 1], {
              extrapolateRight: 'clamp',
            }),
            transform: `translateX(${interpolate(frame, [40, 55], [30, 0], {extrapolateRight: 'clamp'})  }px)`,
          }}
          className="bg-purple-600 text-white px-6 py-4 rounded-full text-4xl whitespace-nowrap"
        >
          👤 Feedback
        </div>
      </div>
    </AbsoluteFill>
  );
};
