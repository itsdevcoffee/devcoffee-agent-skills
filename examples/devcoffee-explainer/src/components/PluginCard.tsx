import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AbsoluteFill} from 'remotion';

interface PluginCardProps {
	name: string;
	features: string[];
	description: string;
	direction: 'left' | 'right';
}

export const PluginCard: React.FC<PluginCardProps> = ({
	name,
	features,
	description,
	direction,
}) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();

	// Slide animation using spring
	const slideProgress = spring({
		frame,
		fps,
		config: {
			damping: 100,
			stiffness: 200,
		},
	});

	// Calculate slide position based on direction
	const slideDistance = width * 0.5;
	const startPosition = direction === 'left' ? -slideDistance : slideDistance;
	const translateX = interpolate(slideProgress, [0, 1], [startPosition, 0]);

	// Fade in animation
	const opacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill className="flex bg-gradient-to-br from-coffee-900 to-coffee-800 items-center justify-center">
			<div
				style={{
					transform: `translateX(${translateX}px)`,
					opacity,
				}}
				className="bg-coffee-800 border-4 border-coffee-600 rounded-2xl p-12 max-w-4xl shadow-2xl"
			>
				<h2 className="text-6xl font-bold text-coffee-100 mb-6">{name}</h2>

				<div className="flex gap-4 mb-8">
					{features.map((feature, index) => (
						<span
							key={feature}
							className="bg-coffee-700 text-coffee-100 px-6 py-3 rounded-full text-2xl font-medium"
							style={{
								opacity: interpolate(
									frame,
									[10 + index * 5, 20 + index * 5],
									[0, 1],
									{
										extrapolateRight: 'clamp',
									}
								),
							}}
						>
							{feature}
						</span>
					))}
				</div>

				<p className="text-3xl text-coffee-200 leading-relaxed">
					{description}
				</p>
			</div>
		</AbsoluteFill>
	);
};
