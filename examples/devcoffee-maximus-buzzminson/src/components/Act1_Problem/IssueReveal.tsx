import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {hiddenIssues} from '../../data/codeSnippets';

export const IssueReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // In a Sequence, frame starts at 0
  // Overall fade in
  const containerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity: containerOpacity}}
      className="flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800"
    >
      {/* Zoomed code background with red overlay */}
      <div className="absolute inset-0 bg-code-background opacity-30" />
      <div className="absolute inset-0 bg-red-500 opacity-10" />

      {/* Issue grid */}
      <div className="grid grid-cols-2 gap-8 max-w-4xl px-8">
        {hiddenIssues.map((issue, index) => {
          // Stagger each issue by 20 frames, starting after initial fade
          const issueStartFrame = 15 + index * 20;

          const opacity = interpolate(
            frame,
            [issueStartFrame, issueStartFrame + 15],
            [0, 1],
            {extrapolateRight: 'clamp'}
          );

          const scale = spring({
            frame: frame - issueStartFrame,
            fps,
            config: {
              damping: 100,
              stiffness: 200,
            },
          });

          return (
            <div
              key={index}
              style={{
                opacity,
                transform: `scale(${scale})`,
              }}
              className="bg-gray-800 bg-opacity-90 backdrop-blur-sm border-2 border-red-500 rounded-lg p-6 shadow-2xl"
            >
              <div className="text-6xl mb-4 text-center">{issue.icon}</div>
              <h3 className="text-xl font-bold text-red-400 mb-2 text-center">
                {issue.label}
              </h3>
              <p className="text-gray-400 text-sm text-center">
                {issue.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <div
        style={{
          opacity: interpolate(frame, [110, 125], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
        className="absolute bottom-20 text-center"
      >
        <p className="text-3xl font-bold text-red-400">
          4 issues hiding in plain sight
        </p>
      </div>
    </AbsoluteFill>
  );
};
