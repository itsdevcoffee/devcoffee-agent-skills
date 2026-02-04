import {interpolate, useCurrentFrame} from 'remotion';
import {AbsoluteFill} from 'remotion';

const features = [
	{icon: '🤖', text: 'Code review automation'},
	{icon: '⚡', text: 'Component generation'},
	{icon: '🚀', text: 'Project setup'},
];

export const FeatureList: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill className="flex bg-gradient-to-br from-coffee-900 to-coffee-800 items-center justify-center">
			<div className="max-w-4xl">
				<h2 className="text-6xl font-bold text-coffee-100 mb-12 text-center">
					Feature Highlights
				</h2>

				<div className="space-y-6">
					{features.map((feature, index) => {
						// Staggered animation for each feature
						const startFrame = index * 10;
						const opacity = interpolate(
							frame,
							[startFrame, startFrame + 15],
							[0, 1],
							{
								extrapolateRight: 'clamp',
							}
						);

						const translateY = interpolate(
							frame,
							[startFrame, startFrame + 15],
							[30, 0],
							{
								extrapolateRight: 'clamp',
							}
						);

						return (
							<div
								key={feature.text}
								style={{
									opacity,
									transform: `translateY(${translateY}px)`,
								}}
								className="flex items-center gap-6 bg-coffee-800 border-2 border-coffee-600 rounded-xl p-8"
							>
								<span className="text-5xl">{feature.icon}</span>
								<span className="text-4xl text-coffee-100 font-medium">
									{feature.text}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
