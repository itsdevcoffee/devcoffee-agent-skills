import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence} from 'remotion';
import {ClarifyPanel} from './ClarifyPanel';
import {ImplementPanel} from './ImplementPanel';
import {ReviewPanel} from './ReviewPanel';
import {HandoffPanel} from './HandoffPanel';

export const WorkflowQuadrants: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Grid appears
  const gridOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity: gridOpacity}}
      className="flex bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800"
    >
      {/* Grid lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-0.5 h-full bg-purple-500 opacity-30" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-0.5 bg-purple-500 opacity-30" />
      </div>

      {/* Quadrant 1 - Top Left - Clarify */}
      <div className="w-1/2 h-1/2 border-r border-b border-purple-500 border-opacity-30">
        <Sequence from={15} durationInFrames={90}>
          <ClarifyPanel />
        </Sequence>
      </div>

      {/* Quadrant 2 - Top Right - Implement */}
      <div className="w-1/2 h-1/2 border-b border-purple-500 border-opacity-30">
        <Sequence from={105} durationInFrames={90}>
          <ImplementPanel />
        </Sequence>
      </div>

      {/* Quadrant 3 - Bottom Left - Review */}
      <div className="w-1/2 h-1/2 border-r border-purple-500 border-opacity-30">
        <Sequence from={195} durationInFrames={90}>
          <ReviewPanel />
        </Sequence>
      </div>

      {/* Quadrant 4 - Bottom Right - Handoff */}
      <div className="w-1/2 h-1/2">
        <Sequence from={285} durationInFrames={90}>
          <HandoffPanel />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
