import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const HandoffPanel: React.FC = () => {
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

  // Baton passing animation
  const batonX = interpolate(frame, [30, 60], [-150, 150], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity, transform: `scale(${scale})`}}
      className="flex flex-col items-center justify-center p-2"
    >
      <div style={{fontSize: 205}} className="mb-2">🤝</div>
      <h3 style={{fontSize: 96}} className="font-bold text-white mb-2">Handoff</h3>
      <p className="text-purple-300 text-center mb-4 text-6xl">Pass to Maximus</p>

      {/* Passing animation */}
      <div className="relative w-full max-w-lg h-36 flex items-center justify-center">
        <div className="absolute left-0" style={{fontSize: 115}}>🌚</div>
        <div
          style={{
            fontSize: 96,
            transform: `translateX(${batonX}px)`,
          }}
          className="absolute"
        >
          🏃
        </div>
        <div className="absolute right-0 opacity-50" style={{fontSize: 115}}>💪</div>
      </div>

      {/* Arrow pointing to Maximus */}
      <div
        style={{
          fontSize: 64,
          opacity: interpolate(frame, [60, 75], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
        className="mt-4 text-green-400"
      >
        ↓
      </div>
    </AbsoluteFill>
  );
};
