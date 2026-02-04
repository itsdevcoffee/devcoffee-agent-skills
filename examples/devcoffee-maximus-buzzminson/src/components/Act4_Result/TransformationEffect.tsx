import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {ParticleEmitter} from '../shared/ParticleEmitter';

export const TransformationEffect: React.FC = () => {
  const frame = useCurrentFrame();

  // Particle burst at key moments
  return (
    <AbsoluteFill className="pointer-events-none">
      {/* Green celebration particles */}
      <ParticleEmitter
        particleCount={30}
        color="#10b981"
        startFrame={90}
        duration={60}
        emitX={960}
        emitY={540}
      />

      {/* Additional particle bursts */}
      <ParticleEmitter
        particleCount={20}
        color="#34d399"
        startFrame={100}
        duration={50}
        emitX={600}
        emitY={300}
      />

      <ParticleEmitter
        particleCount={20}
        color="#34d399"
        startFrame={110}
        duration={50}
        emitX={1320}
        emitY={780}
      />
    </AbsoluteFill>
  );
};
