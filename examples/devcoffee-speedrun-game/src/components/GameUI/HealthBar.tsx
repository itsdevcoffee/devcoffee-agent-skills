import React from 'react';
import {SimpleProgressBar} from '../shared/SimpleProgressBar';
import {RETRO_COLORS} from '../../utils/retroColors';

interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  label = 'HP',
  color = RETRO_COLORS.ui.red,
}) => {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <div
          className="text-pixel pixel-shadow"
          style={{
            fontSize: 16,
            color: RETRO_COLORS.ui.white,
          }}
        >
          {label}
        </div>
      )}
      <div className="pixel-perfect" style={{width: 200, position: 'relative'}}>
        <SimpleProgressBar
          progress={(current / max) * 100}
          height={24}
          backgroundColor={RETRO_COLORS.ui.black}
          fillColor={color}
        />
        {/* Pixel border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 200,
            height: 24,
            border: `3px solid ${RETRO_COLORS.ui.white}`,
            pointerEvents: 'none',
          }}
        />
      </div>
      <div
        className="text-pixel pixel-shadow"
        style={{
          fontSize: 16,
          color: RETRO_COLORS.ui.white,
        }}
      >
        {current}/{max}
      </div>
    </div>
  );
};
