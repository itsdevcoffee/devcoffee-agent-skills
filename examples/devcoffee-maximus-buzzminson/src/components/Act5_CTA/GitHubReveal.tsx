import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

const GITHUB_URL = 'github.com/dev-coffee/devcoffee-agent-skills';

export const GitHubReveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Typing effect
  const charsToShow = Math.floor(
    interpolate(frame, [0, 60], [0, GITHUB_URL.length], {
      extrapolateRight: 'clamp',
    })
  );

  const displayedURL = GITHUB_URL.substring(0, charsToShow);

  // Pulse animation for attention
  const pulseScale = interpolate(
    frame,
    [70, 80, 90, 100],
    [1, 1.05, 1, 1.05],
    {
      extrapolateRight: 'extend',
    }
  );

  return (
    <div className="text-center">
      <p className="text-3xl text-gray-400 mb-4">Get started today</p>
      <div
        style={{transform: `scale(${pulseScale})`}}
        className="bg-gray-800 border-2 border-green-500 rounded-lg px-8 py-6 inline-block"
      >
        <p className="text-5xl font-bold text-green-400 code-font">
          {displayedURL}
          <span className="inline-block w-1 h-10 bg-green-500 ml-2 animate-pulse" />
        </p>
      </div>
    </div>
  );
};
