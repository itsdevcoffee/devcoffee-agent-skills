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
  const batonX = interpolate(frame, [30, 60], [-100, 100], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity, transform: `scale(${scale})`}}
      className="flex flex-col items-center justify-center p-8"
    >
      <div className="text-5xl mb-4">🤝</div>
      <h3 className="text-3xl font-bold text-white mb-4">Handoff</h3>
      <p className="text-purple-300 text-center mb-6">Pass to Maximus</p>

      {/* Passing animation */}
      <div className="relative w-full max-w-xs h-20 flex items-center justify-center">
        <div className="absolute left-0 text-4xl">🌚</div>
        <div
          style={{
            transform: `translateX(${batonX}px)`,
          }}
          className="absolute text-3xl"
        >
          🏃
        </div>
        <div className="absolute right-0 text-4xl opacity-50">💪</div>
      </div>

      {/* Arrow pointing to Maximus */}
      <div
        style={{
          opacity: interpolate(frame, [60, 75], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
        className="mt-4 text-green-400 text-2xl animate-bounce"
      >
        ↓
      </div>
    </AbsoluteFill>
  );
};
