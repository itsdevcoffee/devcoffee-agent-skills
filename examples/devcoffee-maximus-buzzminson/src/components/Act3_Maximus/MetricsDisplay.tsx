import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MetricCard} from '../shared/MetricCard';

export const MetricsDisplay: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill className="flex items-end justify-center pb-12">
      <div className="grid grid-cols-3 gap-6 max-w-4xl">
        <MetricCard
          label="Issues"
          value={0}
          startValue={4}
          startFrame={0}
          endFrame={60}
          color="#10b981"
          icon="🐛"
        />
        <MetricCard
          label="Lines"
          value={89}
          startValue={127}
          startFrame={20}
          endFrame={80}
          color="#10b981"
          icon="📝"
        />
        <MetricCard
          label="Complexity"
          value={2}
          startValue={8}
          unit="/10"
          startFrame={40}
          endFrame={100}
          color="#10b981"
          icon="📊"
        />
      </div>
    </AbsoluteFill>
  );
};
