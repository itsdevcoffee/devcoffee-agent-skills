import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {valuePropositions} from '../../data/metrics';

export const ValueProposition: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const containerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity: containerOpacity}}
      className="flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-gray-800"
    >
      <div className="text-center max-w-4xl px-8">
        <h2 className="text-6xl font-black text-white mb-16 text-glow">
          The DevCoffee Promise
        </h2>

        {/* Value propositions */}
        <div className="space-y-8">
          {valuePropositions.map((proposition, index) => {
            const startFrame = 30 + index * 40;

            const opacity = interpolate(
              frame,
              [startFrame, startFrame + 15],
              [0, 1],
              {extrapolateRight: 'clamp'}
            );

            const scale = spring({
              frame: Math.max(0, frame - startFrame),
              fps,
              config: {damping: 100, stiffness: 200},
            });

            const slideY = interpolate(
              frame,
              [startFrame, startFrame + 20],
              [50, 0],
              {extrapolateRight: 'clamp'}
            );

            return (
              <div
                key={index}
                style={{
                  opacity,
                  transform: `scale(${scale}) translateY(${slideY}px)`,
                }}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-12 py-8 rounded-2xl shadow-2xl"
              >
                <p className="text-4xl font-bold flex items-center justify-center gap-4">
                  <span className="text-5xl">✓</span>
                  <span>{proposition}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* DevCoffee logo/text materialization */}
        <div
          style={{
            opacity: interpolate(frame, [150, 165], [0, 1], {
              extrapolateRight: 'clamp',
            }),
            transform: `scale(${spring({
              frame: Math.max(0, frame - 150),
              fps,
              config: {damping: 100, stiffness: 200},
            })})`,
          }}
          className="mt-16 flex items-center justify-center gap-4"
        >
          <span className="text-7xl">☕</span>
          <div className="text-left">
            <h3 className="text-5xl font-black text-coffee-700">DevCoffee</h3>
            <p className="text-xl text-green-400">Quality code, every time</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
