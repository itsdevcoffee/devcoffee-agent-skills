import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {maximusRounds} from '../../data/metrics';
import {IssueCallout} from './IssueCallout';

interface ReviewRoundProps {
  round: 1 | 2 | 3;
}

export const ReviewRound: React.FC<ReviewRoundProps> = ({round}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const roundData = maximusRounds[round - 1];

  // Round badge
  const badgeOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const badgeScale = spring({
    frame,
    fps,
    config: {damping: 100, stiffness: 200},
  });

  // Scanning animation
  const scanProgress = interpolate(frame, [15, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const isCleanScan = roundData.issuesFound === 0;

  return (
    <AbsoluteFill className="pointer-events-none">
      {/* Round badge */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
        }}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-3xl shadow-lg z-20"
      >
        Round {round} - {roundData.description}
      </div>

      {/* Scanning line */}
      {!isCleanScan && (
        <div
          style={{
            top: `${scanProgress * 100}%`,
            opacity: interpolate(frame, [15, 45, 60], [0, 1, 0], {
              extrapolateRight: 'clamp',
            }),
          }}
          className="absolute left-0 right-0 h-1 bg-green-500 shadow-lg z-10"
        >
          <div className="absolute inset-0 bg-green-400 blur-xl opacity-50" />
        </div>
      )}

      {/* Issue callouts */}
      {!isCleanScan && roundData.issuesFound > 0 && (
        <>
          {Array.from({length: roundData.issuesFound}).map((_, index) => (
            <IssueCallout
              key={index}
              index={index}
              total={roundData.issuesFound}
              startFrame={45 + index * 20}
            />
          ))}
        </>
      )}

      {/* Clean scan celebration */}
      {isCleanScan && (
        <div
          style={{
            opacity: interpolate(frame, [30, 45], [0, 1], {
              extrapolateRight: 'clamp',
            }),
            transform: `scale(${spring({
              frame: Math.max(0, frame - 30),
              fps,
              config: {damping: 100, stiffness: 200},
            })})`,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-green-500 bg-opacity-90 px-16 py-12 rounded-3xl text-center shadow-2xl">
            <div className="text-9xl mb-4">✓</div>
            <h2 className="text-7xl font-black text-white mb-2">CLEAN</h2>
            <p className="text-4xl text-green-100">No issues found</p>
          </div>
        </div>
      )}

      {/* Counter */}
      <div
        style={{
          opacity: interpolate(frame, [60, 75], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 px-8 py-4 rounded-lg text-center"
      >
        <p className="text-3xl font-bold text-white">
          {roundData.issuesFound} found → {roundData.issuesFixed} fixed
        </p>
      </div>
    </AbsoluteFill>
  );
};
