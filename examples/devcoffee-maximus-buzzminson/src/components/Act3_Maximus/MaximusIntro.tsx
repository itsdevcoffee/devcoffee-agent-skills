import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const MaximusIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleScale = spring({
    frame,
    fps,
    config: {damping: 100, stiffness: 200},
  });

  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Pulsing green energy field
  const energyPulse = interpolate(
    frame,
    [0, 30, 60],
    [0.3, 0.6, 0.3],
    {
      extrapolateRight: 'extend',
    }
  );

  return (
    <AbsoluteFill className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Pulsing green energy field background */}
      <div
        style={{opacity: energyPulse}}
        className="absolute inset-0 bg-gradient-radial from-green-500 via-transparent to-transparent"
      />

      <div className="text-center relative z-10">
        {/* Maximus icon */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
          className="text-9xl mb-6"
        >
          💪
        </div>

        {/* Title */}
        <h1
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
          className="text-8xl font-black text-white mb-4 text-glow"
        >
          MAXIMUS
        </h1>

        {/* Subtitle */}
        <p
          style={{opacity: subtitleOpacity}}
          className="text-3xl text-green-400 font-semibold"
        >
          Autonomous Code Quality
        </p>
      </div>
    </AbsoluteFill>
  );
};
