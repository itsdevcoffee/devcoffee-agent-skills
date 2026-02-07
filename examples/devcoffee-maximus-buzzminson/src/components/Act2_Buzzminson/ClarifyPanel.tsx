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
      className="flex flex-col items-center justify-center p-2"
    >
      <div style={{fontSize: 205}} className="mb-2">❓</div>
      <h3 style={{fontSize: 96}} className="font-bold text-white mb-2">Clarify</h3>
      <p className="text-purple-300 text-center mb-4 text-6xl">Ask questions first</p>

      {/* Question to checkmark animation */}
      <div className="flex gap-8">
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
              style={{
                fontSize: 115,
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
