import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ParticleEmitter} from '../shared/ParticleEmitter';

export const WarningParticles: React.FC = () => {
  // Particle positions match the 2x2 grid layout of issues
  // Grid is centered, max-w-4xl (896px), with gap-8 (32px)
  // Screen is 1920x1080
  const centerX = 960;
  const centerY = 540;
  const gridWidth = 896;
  const gridItemWidth = (gridWidth - 32) / 2; // Subtract gap, divide by 2
  const gridItemHeight = 200; // Approximate height of each issue card

  // Calculate positions for 2x2 grid (top-left, top-right, bottom-left, bottom-right)
  const positions = [
    // Top-left (Memory Leak)
    { x: centerX - gridItemWidth / 2 - 16, y: centerY - gridItemHeight - 16 },
    // Top-right (Missing Error Handling)
    { x: centerX + gridItemWidth / 2 + 16, y: centerY - gridItemHeight - 16 },
    // Bottom-left (Security Vulnerability)
    { x: centerX - gridItemWidth / 2 - 16, y: centerY + gridItemHeight + 16 },
    // Bottom-right (Code Complexity)
    { x: centerX + gridItemWidth / 2 + 16, y: centerY + gridItemHeight + 16 },
  ];

  return (
    <AbsoluteFill>
      {/* Emit warning particles from each issue location */}
      {positions.map((pos, index) => (
        <ParticleEmitter
          key={index}
          particleCount={12}
          color={index % 2 === 0 ? '#ef4444' : '#f59e0b'}
          startFrame={15 + index * 20}
          duration={150}
          emitX={pos.x}
          emitY={pos.y}
        />
      ))}
    </AbsoluteFill>
  );
};
