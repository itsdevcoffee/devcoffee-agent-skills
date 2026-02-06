import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const QRCode: React.FC = () => {
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

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
      className="flex flex-col items-center"
    >
      {/* QR Code placeholder (in real implementation, use a QR code library) */}
      <div className="w-64 h-64 bg-white rounded-lg p-4 shadow-2xl border-4 border-green-500">
        <div className="w-full h-full bg-gray-900 rounded grid grid-cols-8 grid-rows-8 gap-1 p-2">
          {Array.from({length: 64}).map((_, i) => {
            // Simple pattern for visual representation
            const isBlack = Math.random() > 0.5;
            return (
              <div
                key={i}
                className={`${isBlack ? 'bg-gray-900' : 'bg-white'} rounded-sm`}
              />
            );
          })}
        </div>
      </div>
      <p className="text-gray-400 text-xl mt-4">Scan to visit repo</p>
    </div>
  );
};
