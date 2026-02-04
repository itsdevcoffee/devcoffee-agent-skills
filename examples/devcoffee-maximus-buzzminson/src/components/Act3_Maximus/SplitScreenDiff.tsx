import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Sequence} from 'remotion';
import {beforeCode, afterCode} from '../../data/codeSnippets';
import {CodeBlock} from '../shared/CodeBlock';
import {ReviewRound} from './ReviewRound';
import {SimplificationViz} from './SimplificationViz';

export const SplitScreenDiff: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity}}
      className="flex bg-gradient-to-br from-gray-900 to-gray-800"
    >
      {/* Vertical divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-green-500 opacity-30 transform -translate-x-1/2 z-10" />

      {/* Left side - BEFORE */}
      <div className="w-1/2 flex flex-col p-8 border-r border-green-500 border-opacity-30">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-red-400 mb-2">BEFORE</h3>
          <p className="text-gray-400 text-sm">Original code with issues</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeBlock code={beforeCode} startFrame={0} endFrame={30} />
        </div>
      </div>

      {/* Right side - AFTER */}
      <div className="w-1/2 flex flex-col p-8">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-green-400 mb-2">AFTER</h3>
          <p className="text-gray-400 text-sm">Fixed and improved</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <CodeBlock code={afterCode} startFrame={30} endFrame={60} />
        </div>
      </div>

      {/* Review rounds overlay */}
      <Sequence from={60} durationInFrames={150}>
        <ReviewRound round={1} />
      </Sequence>

      <Sequence from={210} durationInFrames={120}>
        <ReviewRound round={2} />
      </Sequence>

      <Sequence from={330} durationInFrames={90}>
        <ReviewRound round={3} />
      </Sequence>

      {/* Simplification visualization */}
      <Sequence from={420} durationInFrames={180}>
        <SimplificationViz />
      </Sequence>
    </AbsoluteFill>
  );
};
