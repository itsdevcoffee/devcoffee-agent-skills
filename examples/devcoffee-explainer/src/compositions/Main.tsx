import {Sequence} from 'remotion';
import {TitleCard} from '../components/TitleCard';
import {PluginCard} from '../components/PluginCard';
import {FeatureList} from '../components/FeatureList';
import {CallToAction} from '../components/CallToAction';
import '../style.css';

export const Main: React.FC = () => {
	return (
		<>
			{/* Title Card: 0-3s (frames 0-90) */}
			<Sequence from={0} durationInFrames={90}>
				<TitleCard />
			</Sequence>

			{/* Plugin 1: devcoffee - 3-6s (frames 90-180) */}
			<Sequence from={90} durationInFrames={90}>
				<PluginCard
					name="devcoffee"
					features={['Maximus', 'Buzzminson']}
					description="Automated Code Review & Feature Implementation"
					direction="left"
				/>
			</Sequence>

			{/* Plugin 2: remotion-max - 6-9s (frames 180-270) */}
			<Sequence from={180} durationInFrames={90}>
				<PluginCard
					name="remotion-max"
					features={['29+ Best Practices', 'Intelligent Agents']}
					description="Complete Remotion Toolkit"
					direction="right"
				/>
			</Sequence>

			{/* Feature Highlights: 9-12s (frames 270-360) */}
			<Sequence from={270} durationInFrames={90}>
				<FeatureList />
			</Sequence>

			{/* Call to Action: 12-15s (frames 360-450) */}
			<Sequence from={360} durationInFrames={90}>
				<CallToAction />
			</Sequence>
		</>
	);
};
