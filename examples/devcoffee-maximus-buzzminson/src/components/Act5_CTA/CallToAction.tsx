import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Sequence} from 'remotion';
import {GitHubReveal} from './GitHubReveal';
import {QRCode} from './QRCode';
import {CoffeeSteam} from './CoffeeSteam';

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [90, 105], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{opacity}}
      className="flex items-center justify-center bg-gradient-to-br from-gray-900 via-coffee-900 to-gray-800"
    >
      <div className="max-w-5xl w-full px-8">
        {/* Coffee steam animation */}
        <div className="flex justify-center mb-8">
          <CoffeeSteam />
        </div>

        {/* Main tagline */}
        <h2
          style={{opacity: taglineOpacity}}
          className="text-5xl font-bold text-white text-center mb-12"
        >
          Start shipping quality code today
        </h2>

        {/* GitHub URL */}
        <div className="mb-12">
          <Sequence from={0} durationInFrames={150}>
            <GitHubReveal />
          </Sequence>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <Sequence from={70} durationInFrames={80}>
            <QRCode />
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};
