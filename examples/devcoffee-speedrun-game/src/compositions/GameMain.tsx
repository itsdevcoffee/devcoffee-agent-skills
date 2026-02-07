import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {CRTScanlines} from '../components/RetroEffects/CRTScanlines';
import {HUD} from '../components/GameUI/HUD';
import {InsertCoinScreen} from '../components/GameScene_01_InsertCoin/InsertCoinScreen';
import {CharacterSelect} from '../components/GameScene_01_InsertCoin/CharacterSelect';
import {Level1_ClarifyZone} from '../components/GameScene_02_Buzzminson/Level1_ClarifyZone';
import {Level2_ImplementCastle} from '../components/GameScene_02_Buzzminson/Level2_ImplementCastle';
import {Level3_ReviewArena} from '../components/GameScene_02_Buzzminson/Level3_ReviewArena';
import {Level4_BossHandoff} from '../components/GameScene_02_Buzzminson/Level4_BossHandoff';
import {TopDownStage} from '../components/GameScene_03_Maximus/TopDownStage';
import {ScoreTally} from '../components/GameScene_04_Victory/ScoreTally';
import {FlawlessVictory} from '../components/GameScene_04_Victory/FlawlessVictory';
import {HighScoreEntry} from '../components/GameScene_04_Victory/HighScoreEntry';
import {RETRO_COLORS} from '../utils/retroColors';
import {useCurrentFrame} from 'remotion';

export const GameMain: React.FC = () => {
  const frame = useCurrentFrame();

  // Calculate dynamic HUD values based on current scene
  const getHUDData = () => {
    // Scene 1: Insert Coin (0-150)
    if (frame < 150) {
      return null; // No HUD
    }

    // Scene 2: Buzzminson Levels (150-750)
    if (frame < 750) {
      const localFrame = frame - 150;
      const maxHealth = 5;
      let health = maxHealth;
      let score = 0;
      let combo = 0;
      let multiplier = 1.0;
      let lastHitFrame = undefined;

      // Level 1 (0-150)
      if (localFrame < 150) {
        score = Math.min(Math.floor(localFrame / 30) * 100, 500);
        if (localFrame >= 30 && localFrame < 60) combo = 1;
        if (localFrame >= 60 && localFrame < 90) combo = 2;
        if (localFrame >= 90 && localFrame < 105) combo = 3;
        if (localFrame >= 105 && localFrame < 135) combo = 4;
        multiplier = combo > 0 ? 1 + combo * 0.5 : 1.0;
      }
      // Level 2 (150-300)
      else if (localFrame < 300) {
        score = 500 + Math.min(Math.floor((localFrame - 150) / 35) * 150, 600);
      }
      // Level 3 (300-450)
      else if (localFrame < 450) {
        score = 1100 + Math.min(Math.floor((localFrame - 300) / 37) * 250, 1000);
        if (localFrame >= 337 && localFrame < 372) combo = 1;
        if (localFrame >= 372 && localFrame < 407) combo = 2;
        if (localFrame >= 407 && localFrame < 432) combo = 3;
        multiplier = combo > 0 ? 1 + combo * 0.5 : 1.0;
        if (combo > 0) lastHitFrame = 150 + localFrame;
      }
      // Level 4 (450-600)
      else {
        score = 2100 + Math.min(Math.floor((localFrame - 450) / 60) * 1000, 3000);
      }

      return {
        health,
        maxHealth,
        score,
        combo,
        multiplier,
        lastHitFrame,
        characterName: 'BUZZMINSON',
      };
    }

    // Scene 3: Maximus Phases (750-1200)
    if (frame < 1200) {
      const localFrame = frame - 750;
      const maxHealth = 5;
      let health = maxHealth;
      let score = 2500; // Starting from Buzzminson total
      let combo = 0;
      let multiplier = 1.0;
      let lastHitFrame = undefined;

      // Phase 1: Bug shooting (0-150)
      if (localFrame < 150) {
        score += Math.min(Math.floor(localFrame / 18) * 150, 1200);
        if (localFrame >= 25 && localFrame < 35) combo = 1;
        if (localFrame >= 35 && localFrame < 50) combo = 2;
        if (localFrame >= 50 && localFrame < 60) combo = 3;
        if (localFrame >= 60 && localFrame < 80) combo = 4;
        multiplier = combo > 0 ? 1 + combo * 0.5 : 1.0;
        if (combo > 0) lastHitFrame = 750 + localFrame;
      }
      // Phase 2: Complexity barriers (150-300)
      else if (localFrame < 300) {
        score = 3700 + Math.min(Math.floor((localFrame - 150) / 40) * 200, 1200);
      }
      // Phase 3: Boss bug (300-450)
      else {
        score = 4900 + Math.min(Math.floor((localFrame - 300) / 15) * 500, 5000);
        combo = Math.min(Math.floor((localFrame - 300) / 15), 5);
        multiplier = combo > 0 ? 1 + combo * 0.5 : 1.0;
        if (combo > 0) lastHitFrame = 750 + localFrame;
      }

      return {
        health,
        maxHealth,
        score,
        combo,
        multiplier,
        lastHitFrame,
        characterName: 'MAXIMUS',
      };
    }

    // Scene 4: Victory (1200-1350)
    return null; // No HUD
  };

  const hudData = getHUDData();

  return (
    <AbsoluteFill>
      {/* Scene 1: Insert Coin (0-150 frames / 0-5s) */}
      <Sequence from={0} durationInFrames={90}>
        <InsertCoinScreen />
      </Sequence>

      <Sequence from={90} durationInFrames={60}>
        <CharacterSelect />
      </Sequence>

      {/* Scene 2: Buzzminson Platformer Levels (150-750 frames / 5-25s) */}
      <Sequence from={150} durationInFrames={150}>
        <Level1_ClarifyZone />
      </Sequence>

      <Sequence from={300} durationInFrames={150}>
        <Level2_ImplementCastle />
      </Sequence>

      <Sequence from={450} durationInFrames={150}>
        <Level3_ReviewArena />
      </Sequence>

      <Sequence from={600} durationInFrames={150}>
        <Level4_BossHandoff />
      </Sequence>

      {/* Scene 3: Maximus Shooter (750-1200 frames / 25-40s) */}
      <Sequence from={750} durationInFrames={450}>
        <TopDownStage />
      </Sequence>

      {/* Scene 4: Victory Screen (1200-1350 frames / 40-45s) */}
      <Sequence from={1200} durationInFrames={150}>
        <AbsoluteFill style={{backgroundColor: RETRO_COLORS.environment.sky}}>
          {/* Flawless Victory banner */}
          <div
            style={{
              position: 'absolute',
              top: 150,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <FlawlessVictory />
          </div>

          {/* Score tally */}
          <div
            style={{
              position: 'absolute',
              top: 350,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 800,
            }}
          >
            <ScoreTally />
          </div>

          {/* High score entry */}
          <div
            style={{
              position: 'absolute',
              bottom: 100,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <HighScoreEntry />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Persistent HUD (during gameplay scenes) */}
      {hudData && (
        <HUD
          health={hudData.health}
          maxHealth={hudData.maxHealth}
          score={hudData.score}
          combo={hudData.combo}
          multiplier={hudData.multiplier}
          lastHitFrame={hudData.lastHitFrame}
          characterName={hudData.characterName}
        />
      )}

      {/* Persistent CRT effect (all scenes) */}
      <CRTScanlines intensity={0.3} />
    </AbsoluteFill>
  );
};
