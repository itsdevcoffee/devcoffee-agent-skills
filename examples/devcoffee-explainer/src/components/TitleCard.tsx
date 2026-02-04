import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AbsoluteFill} from 'remotion';

export const TitleCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Fade in animation
	const opacity = interpolate(frame, [0, 15], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Scale animation using spring for natural feel
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 100,
			stiffness: 200,
			mass: 0.5,
		},
	});

	// Coffee cup rotation animation
	const cupRotation = interpolate(frame, [0, 30, 60], [0, -10, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill className="flex bg-gradient-to-br from-coffee-900 to-coffee-800 items-center justify-center">
			<div
				style={{
					opacity,
					transform: `scale(${scale})`,
				}}
				className="flex flex-col items-center"
			>
				<div className="flex items-center gap-6">
					<span
						style={{
							transform: `rotate(${cupRotation}deg)`,
							display: 'inline-block',
						}}
						className="text-7xl"
					>
						☕
					</span>
					<h1 className="text-8xl font-bold text-coffee-50">Dev Coffee</h1>
				</div>
				<p className="text-3xl text-coffee-200 mt-6">
					Claude Code Plugin Marketplace
				</p>
			</div>
		</AbsoluteFill>
	);
};
