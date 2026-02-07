import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {MaximusShip} from './MaximusShip';
import {BugEnemy} from './BugEnemy';
import {Projectile} from './Projectile';
import {Explosion} from './Explosion';
import {PowerUp} from './PowerUp';
import {ComplexityBarrier} from './ComplexityBarrier';
import {maximusWaves, complexityBarriers, powerUps, bossBugData} from '../../data/gameData';
import {RETRO_COLORS} from '../../utils/retroColors';
import {RetroText} from '../RetroEffects/RetroText';
import {PixelTransition} from '../RetroEffects/PixelTransition';

export const TopDownStage: React.FC = () => {
  const frame = useCurrentFrame();

  // Ship position (player-controlled feel with automated movement)
  const shipX = 936; // Center X
  const shipY = interpolate(frame, [0, 30], [900, 750], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine current phase
  const getPhase = (): 1 | 2 | 3 => {
    if (frame < 150) return 1; // Bug shooting (0-150)
    if (frame < 300) return 2; // Complexity barriers (150-300)
    return 3; // Boss bug (300-450)
  };

  const phase = getPhase();

  // Phase 1: Bug shooting
  const bugsDefeated = [
    {id: 1, frame: 25},
    {id: 2, frame: 35},
    {id: 3, frame: 50},
    {id: 4, frame: 60},
    {id: 5, frame: 80},
    {id: 6, frame: 95},
    {id: 7, frame: 110},
    {id: 8, frame: 130},
  ];

  const projectiles = [
    20, 30, 45, 55, 75, 90, 105, 125,
  ];

  // Phase 2: Complexity barriers
  const barrierHP = [
    {id: 1, hp: frame < 180 ? 3 : frame < 190 ? 2 : frame < 200 ? 1 : 0, lastHit: 180},
    {id: 2, hp: frame < 220 ? 3 : frame < 230 ? 2 : frame < 240 ? 1 : 0, lastHit: 220},
    {id: 3, hp: frame < 260 ? 3 : frame < 270 ? 2 : frame < 280 ? 1 : 0, lastHit: 260},
  ];

  const powerUpsCollected = [
    {id: 1, frame: 210},
    {id: 2, frame: 250},
    {id: 3, frame: 290},
  ];

  // Phase 3: Boss bug
  const bossBugHP = Math.max(0, 10 - Math.floor((frame - 300) / 15));
  const bossBugY = 200 + Math.sin((frame - 300) * 0.1) * 40;
  const bossBugX = 960 + Math.cos((frame - 300) * 0.08) * 200;

  const bossProjectiles = Array.from({length: 10}, (_, i) => 300 + i * 15);

  // Phase titles
  const getTitleText = (): string => {
    switch (phase) {
      case 1:
        return 'PHASE 1: BUG DETECTION';
      case 2:
        return 'PHASE 2: SIMPLIFICATION';
      case 3:
        return 'PHASE 3: FINAL CLEANUP';
    }
  };

  const titleOpacity =
    (phase === 1 && frame < 15) ||
    (phase === 2 && frame >= 150 && frame < 165) ||
    (phase === 3 && frame >= 300 && frame < 315)
      ? interpolate(
          frame % 150,
          [0, 15],
          [0, 1],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        )
      : 0;

  return (
    <AbsoluteFill style={{backgroundColor: RETRO_COLORS.environment.sky}}>
      {/* Phase title */}
      {titleOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: titleOpacity,
          }}
        >
          <RetroText size={36} color={RETRO_COLORS.maximus.highlight} glow>
            {getTitleText()}
          </RetroText>
        </div>
      )}

      {/* Phase 1: Bug waves */}
      {phase === 1 &&
        maximusWaves.map((wave) => {
          return wave.enemies.map((enemy) => {
            const defeated = bugsDefeated.find((d) => d.id === enemy.id);
            return (
              <React.Fragment key={enemy.id}>
                <BugEnemy
                  x={enemy.spawnX}
                  y={enemy.spawnY}
                  pattern={enemy.pattern}
                  startFrame={wave.startFrame}
                  exploded={defeated ? frame >= defeated.frame : false}
                  explodeFrame={defeated?.frame}
                />
                {defeated && frame >= defeated.frame && (
                  <Explosion
                    x={enemy.spawnX + 16}
                    y={enemy.spawnY + (defeated.frame - wave.startFrame) * 4 + 16}
                    startFrame={defeated.frame}
                    size="medium"
                  />
                )}
              </React.Fragment>
            );
          });
        })}

      {/* Phase 2: Complexity barriers */}
      {phase === 2 &&
        complexityBarriers.map((barrier, index) => {
          const hpData = barrierHP.find((b) => b.id === barrier.id);
          return (
            <React.Fragment key={barrier.id}>
              <ComplexityBarrier
                x={barrier.x}
                y={barrier.y}
                width={barrier.width}
                height={barrier.height}
                maxHp={barrier.hp}
                currentHp={hpData?.hp || 0}
                lastHitFrame={hpData?.lastHit}
              />
              {hpData?.hp === 0 && (
                <Explosion
                  x={barrier.x + barrier.width / 2}
                  y={barrier.y + barrier.height / 2}
                  startFrame={hpData.lastHit + 15}
                  size="large"
                />
              )}
            </React.Fragment>
          );
        })}

      {/* Phase 2: Power-ups */}
      {phase === 2 &&
        powerUps.map((powerUp) => {
          const collected = powerUpsCollected.find((p) => p.id === powerUp.id);
          return (
            <PowerUp
              key={powerUp.id}
              x={powerUp.x}
              y={powerUp.y}
              appearFrame={150 + powerUp.appearFrame}
              collected={collected ? frame >= collected.frame : false}
              collectFrame={collected?.frame}
            />
          );
        })}

      {/* Phase 3: Boss bug */}
      {phase === 3 && bossBugHP > 0 && (
        <div
          className="pixel-perfect"
          style={{
            position: 'absolute',
            left: bossBugX,
            top: bossBugY,
            width: 80,
            height: 80,
          }}
        >
          {/* Boss bug sprite - larger, angrier */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: RETRO_COLORS.enemies.bossBug,
              border: `6px solid ${RETRO_COLORS.ui.black}`,
              borderRadius: '20%',
              position: 'relative',
            }}
          >
            {/* Eyes */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 15,
                width: 12,
                height: 12,
                backgroundColor: RETRO_COLORS.ui.yellow,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 53,
                width: 12,
                height: 12,
                backgroundColor: RETRO_COLORS.ui.yellow,
              }}
            />

            {/* HP bar */}
            <div
              style={{
                position: 'absolute',
                bottom: -20,
                left: 0,
                width: 80,
                height: 8,
                backgroundColor: RETRO_COLORS.ui.black,
                border: `2px solid ${RETRO_COLORS.ui.white}`,
              }}
            >
              <div
                style={{
                  width: `${(bossBugHP / 10) * 100}%`,
                  height: '100%',
                  backgroundColor: RETRO_COLORS.ui.red,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Boss defeat explosion */}
      {phase === 3 && bossBugHP === 0 && frame >= 450 && (
        <Explosion
          x={bossBugX + 40}
          y={bossBugY + 40}
          startFrame={450}
          size="large"
        />
      )}

      {/* Projectiles */}
      {projectiles.map((pFrame, i) => {
        if (phase === 1 && frame >= pFrame) {
          return (
            <Projectile
              key={`p1-${i}`}
              startX={shipX + 24}
              startY={shipY}
              startFrame={pFrame}
            />
          );
        }
        return null;
      })}

      {phase === 3 &&
        bossProjectiles.map((pFrame, i) => {
          if (frame >= pFrame) {
            return (
              <Projectile
                key={`p3-${i}`}
                startX={shipX + 24}
                startY={shipY}
                startFrame={pFrame}
              />
            );
          }
          return null;
        })}

      {/* Maximus ship */}
      <MaximusShip
        x={shipX}
        y={shipY}
        shooting={
          (phase === 1 && projectiles.some((p) => frame === p)) ||
          (phase === 3 && bossProjectiles.some((p) => frame === p))
        }
        powered={
          phase === 2 && powerUpsCollected.some((p) => frame >= p.frame && frame < p.frame + 30)
        }
      />

      {/* Phase transition */}
      {phase === 2 && frame >= 145 && frame < 155 && (
        <PixelTransition
          startFrame={145}
          durationInFrames={10}
          type="fade"
          color={RETRO_COLORS.ui.black}
        />
      )}
      {phase === 3 && frame >= 295 && frame < 305 && (
        <PixelTransition
          startFrame={295}
          durationInFrames={10}
          type="fade"
          color={RETRO_COLORS.ui.black}
        />
      )}
    </AbsoluteFill>
  );
};
