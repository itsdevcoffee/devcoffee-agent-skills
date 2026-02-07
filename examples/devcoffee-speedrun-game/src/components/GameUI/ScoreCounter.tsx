import React from 'react';
import {SimpleCounter} from '../shared/SimpleCounter';
import {RETRO_COLORS} from '../../utils/retroColors';

interface ScoreCounterProps {
  value: number;
  label?: string;
  startFrame?: number;
  color?: string;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({
  value,
  label = 'SCORE',
  startFrame = 0,
  color = RETRO_COLORS.ui.yellow,
}) => {
  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className="text-pixel pixel-shadow"
        style={{
          fontSize: 14,
          color: RETRO_COLORS.ui.white,
        }}
      >
        {label}
      </div>
      <div
        className="text-pixel pixel-shadow"
        style={{
          fontSize: 32,
          color,
        }}
      >
        <SimpleCounter
          target={value}
          startFrame={startFrame}
          durationInFrames={30}
          prefix=""
          suffix=""
        />
      </div>
    </div>
  );
};
