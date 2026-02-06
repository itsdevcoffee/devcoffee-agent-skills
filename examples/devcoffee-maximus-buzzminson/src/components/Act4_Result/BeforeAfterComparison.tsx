import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {metricsComparison} from '../../data/metrics';
import {Counter} from '../shared/Counter';

export const BeforeAfterComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity}}
      className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="max-w-6xl w-full px-8">
        <h2 className="text-5xl font-bold text-white text-center mb-16">
          The Transformation
        </h2>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-2 gap-12">
          {/* BEFORE */}
          <div className="space-y-6">
            <h3 className="text-5xl font-bold text-red-400 text-center mb-8">
              BEFORE
            </h3>
            {metricsComparison.map((metric, index) => {
              const startFrame = 30 + index * 15;
              const scale = spring({
                frame: Math.max(0, frame - startFrame),
                fps,
                config: {damping: 100, stiffness: 200},
              });

              return (
                <div
                  key={index}
                  style={{transform: `scale(${scale})`}}
                  className="bg-gray-800 bg-opacity-80 border-2 border-red-500 rounded-lg p-6"
                >
                  <p className="text-gray-400 text-3xl uppercase tracking-wider mb-2">
                    {metric.label}
                  </p>
                  <p className="text-7xl font-bold text-red-400">
                    {metric.before}
                    <span className="text-4xl text-gray-500 ml-2">
                      {metric.unit}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* AFTER */}
          <div className="space-y-6">
            <h3 className="text-5xl font-bold text-green-400 text-center mb-8">
              AFTER
            </h3>
            {metricsComparison.map((metric, index) => {
              const startFrame = 30 + index * 15;
              const endFrame = startFrame + 60;
              const scale = spring({
                frame: Math.max(0, frame - startFrame),
                fps,
                config: {damping: 100, stiffness: 200},
              });

              return (
                <div
                  key={index}
                  style={{transform: `scale(${scale})`}}
                  className="bg-gray-800 bg-opacity-80 border-2 border-green-500 rounded-lg p-6 relative overflow-hidden"
                >
                  {/* Green glow effect */}
                  <div
                    style={{
                      opacity: interpolate(frame, [endFrame, endFrame + 15], [0, 0.2], {
                        extrapolateRight: 'clamp',
                      }),
                    }}
                    className="absolute inset-0 bg-green-500"
                  />

                  <p className="text-gray-400 text-3xl uppercase tracking-wider mb-2 relative z-10">
                    {metric.label}
                  </p>
                  <div className="relative z-10">
                    <Counter
                      from={metric.before}
                      to={metric.after}
                      startFrame={startFrame}
                      endFrame={endFrame}
                      className="text-7xl font-bold text-green-400"
                      suffix={` ${metric.unit}`}
                    />
                  </div>

                  {/* Improvement percentage */}
                  <div
                    style={{
                      opacity: interpolate(frame, [endFrame + 10, endFrame + 25], [0, 1], {
                        extrapolateRight: 'clamp',
                      }),
                    }}
                    className="mt-2 text-green-300 text-xl font-semibold relative z-10"
                  >
                    ↑ {metric.improvement}% improvement
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
