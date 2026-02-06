import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {simplificationMetrics} from '../../data/codeSnippets';
import {Counter} from '../shared/Counter';

export const SimplificationViz: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Code compression animation
  const compressionScale = interpolate(frame, [30, 90], [1, 0.7], {
    extrapolateRight: 'clamp',
  });

  const compressionOpacity = interpolate(frame, [30, 60, 90], [1, 0.5, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity}}
      className="flex items-center justify-center bg-gray-900 bg-opacity-90 backdrop-blur-sm"
    >
      <div className="text-center">
        <h2 className="text-5xl font-bold text-white mb-12">
          Code Simplification
        </h2>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-12 mb-12">
          {/* Lines of code */}
          <div
            style={{
              transform: `scale(${spring({
                frame,
                fps,
                config: {damping: 100, stiffness: 200},
              })})`,
            }}
            className="bg-gray-800 rounded-lg p-8 border border-green-500"
          >
            <p className="text-gray-400 text-3xl mb-2">Lines of Code</p>
            <div className="flex items-baseline justify-center gap-4">
              <Counter
                from={simplificationMetrics.before.lines}
                to={simplificationMetrics.after.lines}
                startFrame={30}
                endFrame={90}
                className="text-7xl font-bold text-green-400"
              />
            </div>
            <p className="text-gray-500 text-xl mt-2">
              {simplificationMetrics.before.lines} → {simplificationMetrics.after.lines}
            </p>
          </div>

          {/* Complexity */}
          <div
            style={{
              transform: `scale(${spring({
                frame: Math.max(0, frame - 20),
                fps,
                config: {damping: 100, stiffness: 200},
              })})`,
            }}
            className="bg-gray-800 rounded-lg p-8 border border-green-500"
          >
            <p className="text-gray-400 text-3xl mb-2">Complexity</p>
            <div className="flex items-baseline justify-center gap-4">
              <Counter
                from={simplificationMetrics.before.complexity}
                to={simplificationMetrics.after.complexity}
                startFrame={30}
                endFrame={90}
                className="text-7xl font-bold text-green-400"
                suffix="/10"
              />
            </div>
            <p className="text-gray-500 text-xl mt-2">
              {simplificationMetrics.before.complexity} → {simplificationMetrics.after.complexity}
            </p>
          </div>

          {/* Issues */}
          <div
            style={{
              transform: `scale(${spring({
                frame: Math.max(0, frame - 40),
                fps,
                config: {damping: 100, stiffness: 200},
              })})`,
            }}
            className="bg-gray-800 rounded-lg p-8 border border-green-500"
          >
            <p className="text-gray-400 text-3xl mb-2">Issues</p>
            <div className="flex items-baseline justify-center gap-4">
              <Counter
                from={simplificationMetrics.before.issues}
                to={simplificationMetrics.after.issues}
                startFrame={30}
                endFrame={90}
                className="text-7xl font-bold text-green-400"
              />
            </div>
            <p className="text-gray-500 text-xl mt-2">
              {simplificationMetrics.before.issues} → {simplificationMetrics.after.issues}
            </p>
          </div>
        </div>

        {/* Improvement message */}
        <div
          style={{
            opacity: interpolate(frame, [120, 135], [0, 1], {
              extrapolateRight: 'clamp',
            }),
          }}
          className="text-4xl text-green-400 font-semibold"
        >
          ✓ Code quality improved by 85%
        </div>
      </div>
    </AbsoluteFill>
  );
};
