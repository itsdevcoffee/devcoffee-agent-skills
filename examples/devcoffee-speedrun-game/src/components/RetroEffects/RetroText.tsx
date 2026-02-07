import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

interface RetroTextProps {
  children: string;
  size?: number;
  color?: string;
  glow?: boolean;
  blink?: boolean;
  blinkSpeed?: number;
  startFrame?: number;
  style?: React.CSSProperties;
}

export const RetroText: React.FC<RetroTextProps> = ({
  children,
  size = 48,
  color = '#FFD700',
  glow = false,
  blink = false,
  blinkSpeed = 30,
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  const opacity = blink
    ? Math.floor(localFrame / blinkSpeed) % 2 === 0
      ? 1
      : 0
    : 1;

  return (
    <div
      className="text-pixel pixel-shadow"
      style={{
        fontSize: size,
        color,
        opacity,
        textShadow: glow
          ? `0 0 ${size / 6}px ${color}, 0 0 ${size / 3}px ${color}, 2px 2px 0 rgba(0, 0, 0, 0.8)`
          : '2px 2px 0 rgba(0, 0, 0, 0.8)',
        letterSpacing: '2px',
        fontFamily: 'Monaco, Menlo, "Courier New", monospace',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
