import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const TestCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Fade in animation
	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Scale animation with spring for natural feel
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 100,
			stiffness: 200,
			mass: 0.5,
		},
	});

	return (
		<AbsoluteFill className="flex items-center justify-center bg-gradient-to-br from-green-900 to-green-700">
			<div
				style={{
					opacity,
					transform: `scale(${scale})`,
				}}
				className="text-center"
			>
				<h1 className="text-8xl font-bold text-green-50 mb-4">
					✅ Remotion Max Works!
				</h1>
				<p className="text-3xl text-green-200">
					All critical fixes applied
				</p>
			</div>
		</AbsoluteFill>
	);
};
