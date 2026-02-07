import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HealthBar} from './HealthBar';
import {ScoreCounter} from './ScoreCounter';
import {ComboMeter} from './ComboMeter';
import {RETRO_COLORS} from '../../utils/retroColors';

interface HUDProps {
  health: number;
  maxHealth: number;
  score: number;
  combo?: number;
  multiplier?: number;
  lastHitFrame?: number;
  characterName?: string;
}

export const HUD: React.FC<HUDProps> = ({
  health,
  maxHealth,
  score,
  combo = 0,
  multiplier = 1,
  lastHitFrame,
  characterName = 'PLAYER',
}) => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 9000}}>
      {/* Top bar with dark background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          borderBottom: `4px solid ${RETRO_COLORS.ui.white}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
          }}
        >
          {/* Left: Character name and health */}
          <div className="flex flex-col gap-2">
            <div
              className="text-pixel pixel-shadow"
              style={{
                fontSize: 18,
                color: RETRO_COLORS.ui.cyan,
              }}
            >
              {characterName}
            </div>
            <HealthBar current={health} max={maxHealth} label="HP" />
          </div>

          {/* Right: Score */}
          <ScoreCounter value={score} label="SCORE" />
        </div>
      </div>

      {/* Center: Combo meter */}
      {combo > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <ComboMeter
            combo={combo}
            multiplier={multiplier}
            lastHitFrame={lastHitFrame}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
