import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const BuzzminstonIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Moon appears first
  const moonOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const moonScale = spring({
    frame,
    fps,
    config: {damping: 100, stiffness: 200},
  });

  // Bee appears and moves to merge with moon
  const beeOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const beeX = interpolate(frame, [35, 60], [200, 0], {
    extrapolateRight: 'clamp',
  });

  const beeScale = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: {damping: 100, stiffness: 200},
  });

  // Combined "Buzzminson" text
  const textOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill className="flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
      <div className="text-center">
        {/* Moon and Bee merge */}
        <div className="relative mb-8">
          <div
            style={{
              opacity: moonOpacity,
              transform: `scale(${moonScale})`,
            }}
            className="text-9xl"
          >
            🌚
          </div>
          <div
            style={{
              opacity: beeOpacity,
              transform: `translateX(${beeX}px) scale(${beeScale})`,
              position: 'absolute',
              top: 0,
              left: '50%',
              marginLeft: -64,
            }}
            className="text-9xl"
          >
            🐝
          </div>
        </div>

        {/* Buzzminson name */}
        <h1
          style={{opacity: textOpacity}}
          className="text-7xl font-bold text-white mb-4 text-glow"
        >
          Buzzminson
        </h1>

        {/* Tagline */}
        <p
          style={{opacity: taglineOpacity}}
          className="text-2xl text-purple-300"
        >
          Your feature implementation partner
        </p>
      </div>
    </AbsoluteFill>
  );
};
