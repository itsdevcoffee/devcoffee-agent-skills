import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';

// Act 1 - The Problem (0-10s, frames 0-300)
import {CodeEditor} from '../components/Act1_Problem/CodeEditor';
import {IssueReveal} from '../components/Act1_Problem/IssueReveal';
import {WarningParticles} from '../components/Act1_Problem/WarningParticles';

// Act 2 - Buzzminson (10-25s, frames 300-750)
import {BuzzminstonIntro} from '../components/Act2_Buzzminson/BuzzminstonIntro';
import {WorkflowQuadrants} from '../components/Act2_Buzzminson/WorkflowQuadrants';

// Act 3 - Maximus (25-45s, frames 750-1350)
import {MaximusIntro} from '../components/Act3_Maximus/MaximusIntro';
import {SplitScreenDiff} from '../components/Act3_Maximus/SplitScreenDiff';

// Act 4 - The Result (45-55s, frames 1350-1650)
import {BeforeAfterComparison} from '../components/Act4_Result/BeforeAfterComparison';
import {TransformationEffect} from '../components/Act4_Result/TransformationEffect';
import {ValueProposition} from '../components/Act4_Result/ValueProposition';

// Act 5 - CTA (55-60s, frames 1650-1800)
import {CallToAction} from '../components/Act5_CTA/CallToAction';

export const Main: React.FC = () => {
  return (
    <AbsoluteFill className="bg-gray-900">
      {/* ACT 1: THE PROBLEM (0-10s, frames 0-300) */}
      <Sequence from={0} durationInFrames={150}>
        <CodeEditor />
      </Sequence>

      <Sequence from={150} durationInFrames={150}>
        <IssueReveal />
        <WarningParticles />
      </Sequence>

      {/* ACT 2: BUZZMINSON (10-25s, frames 300-750) */}
      {/* Intro: frames 300-390 (3s) */}
      <Sequence from={300} durationInFrames={90}>
        <BuzzminstonIntro />
      </Sequence>

      {/* Workflow: frames 390-750 (12s) */}
      <Sequence from={390} durationInFrames={360}>
        <WorkflowQuadrants />
      </Sequence>

      {/* ACT 3: MAXIMUS (25-45s, frames 750-1350) */}
      {/* Intro: frames 750-840 (3s) */}
      <Sequence from={750} durationInFrames={90}>
        <MaximusIntro />
      </Sequence>

      {/* Split-screen diff with review rounds: frames 840-1350 (17s) */}
      <Sequence from={840} durationInFrames={510}>
        <SplitScreenDiff />
      </Sequence>

      {/* ACT 4: THE RESULT (45-55s, frames 1350-1650) */}
      {/* Before/After comparison: frames 1350-1500 (5s) */}
      <Sequence from={1350} durationInFrames={150}>
        <BeforeAfterComparison />
        <TransformationEffect />
      </Sequence>

      {/* Value proposition: frames 1500-1650 (5s) */}
      <Sequence from={1500} durationInFrames={150}>
        <ValueProposition />
      </Sequence>

      {/* ACT 5: CALL TO ACTION (55-60s, frames 1650-1800) */}
      <Sequence from={1650} durationInFrames={150}>
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};
