import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

interface IssueCalloutProps {
  index: number;
  total: number;
  startFrame: number;
}

const issueMessages = [
  'Missing null check',
  'No error handling',
  'Potential memory leak',
  'Unvalidated input',
];

export const IssueCallout: React.FC<IssueCalloutProps> = ({
  index,
  total,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const localFrame = frame - startFrame;

  // Issue highlight appears
  const highlightOpacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const highlightScale = spring({
    frame: localFrame,
    fps,
    config: {damping: 100, stiffness: 300},
  });

  // Fix animation (red → green)
  const isFixed = localFrame > 20;
  const fixScale = spring({
    frame: Math.max(0, localFrame - 20),
    fps,
    config: {damping: 100, stiffness: 300},
  });

  // Position based on index
  const yPosition = 200 + index * 150;
  const xPosition = 200;

  return (
    <div
      style={{
        position: 'absolute',
        left: xPosition,
        top: yPosition,
        opacity: highlightOpacity,
        transform: `scale(${highlightScale})`,
      }}
      className="z-30"
    >
      {/* Issue indicator */}
      {!isFixed && (
        <div className="bg-red-500 bg-opacity-90 px-6 py-3 rounded-lg shadow-xl border-2 border-red-400">
          <p className="text-white font-semibold flex items-center gap-2">
            <span className="text-2xl">🔴</span>
            <span>{issueMessages[index % issueMessages.length]}</span>
          </p>
        </div>
      )}

      {/* Fixed indicator */}
      {isFixed && (
        <div
          style={{transform: `scale(${fixScale})`}}
          className="bg-green-500 bg-opacity-90 px-6 py-3 rounded-lg shadow-xl border-2 border-green-400"
        >
          <p className="text-white font-semibold flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Fixed</span>
          </p>
        </div>
      )}

      {/* Connecting line to code */}
      <div className="absolute top-1/2 left-full w-20 h-0.5 bg-red-500" />
    </div>
  );
};
