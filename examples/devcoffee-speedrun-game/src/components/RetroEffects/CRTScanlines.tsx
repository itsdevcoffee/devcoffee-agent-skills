import React from 'react';
import {AbsoluteFill} from 'remotion';

interface CRTScanlinesProps {
  intensity?: number;
}

export const CRTScanlines: React.FC<CRTScanlinesProps> = ({
  intensity = 0.3,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* Scanlines */}
      <div
        className="scanlines"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, ${intensity}) 2px,
            rgba(0, 0, 0, ${intensity}) 4px
          )`,
        }}
      />

      {/* CRT Vignette */}
      <div
        className="crt-vignette"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          boxShadow: 'inset 0 0 200px rgba(0, 0, 0, 0.8)',
          borderRadius: '4px',
        }}
      />

      {/* Subtle screen curve effect */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
