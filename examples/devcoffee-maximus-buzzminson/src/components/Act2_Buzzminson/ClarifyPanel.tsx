import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const ClarifyPanel: React.FC = () => {
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

  // Question marks transform to checkmarks
  const questions = ['?', '?', '?'];

  return (
    <AbsoluteFill
      style={{opacity, transform: `scale(${scale})`}}
      className="flex flex-col items-center justify-center p-8"
    >
      <div className="text-5xl mb-4">❓</div>
      <h3 className="text-3xl font-bold text-white mb-4">Clarify</h3>
      <p className="text-purple-300 text-center mb-6">Ask questions first</p>

      {/* Question to checkmark animation */}
      <div className="flex gap-4">
        {questions.map((q, index) => {
          const checkFrame = 30 + index * 15;
          const showCheck = frame > checkFrame;

          const checkScale = spring({
            frame: Math.max(0, frame - checkFrame),
            fps,
            config: {damping: 100, stiffness: 300},
          });

          return (
            <div
              key={index}
              className="text-4xl"
              style={{
                transform: showCheck ? `scale(${checkScale})` : 'scale(1)',
              }}
            >
              {showCheck ? '✓' : q}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
