import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AbsoluteFill} from 'remotion';

export const CallToAction: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Fade in animation
	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Scale animation with spring
	const scale = spring({
		frame,
		fps,
		config: {
			damping: 100,
			stiffness: 200,
			mass: 0.5,
		},
	});

	// Steam animation - continuous floating
	const steamY1 = interpolate(frame, [0, 60], [0, -30], {
		extrapolateRight: 'clamp',
	});
	const steamOpacity1 = interpolate(frame, [0, 30, 60], [1, 0.5, 0], {
		extrapolateRight: 'clamp',
	});

	const steamY2 = interpolate(frame, [10, 70], [0, -30], {
		extrapolateRight: 'clamp',
	});
	const steamOpacity2 = interpolate(frame, [10, 40, 70], [1, 0.5, 0], {
		extrapolateRight: 'clamp',
	});

	const steamY3 = interpolate(frame, [20, 80], [0, -30], {
		extrapolateRight: 'clamp',
	});
	const steamOpacity3 = interpolate(frame, [20, 50, 80], [1, 0.5, 0], {
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
				<div className="relative mb-8">
					<span className="text-9xl">☕</span>
					{/* Steam effects */}
					<span
						style={{
							position: 'absolute',
							top: -10,
							left: 30,
							transform: `translateY(${steamY1}px)`,
							opacity: steamOpacity1,
							fontSize: '2rem',
						}}
					>
						~
					</span>
					<span
						style={{
							position: 'absolute',
							top: -10,
							left: 50,
							transform: `translateY(${steamY2}px)`,
							opacity: steamOpacity2,
							fontSize: '2rem',
						}}
					>
						~
					</span>
					<span
						style={{
							position: 'absolute',
							top: -10,
							left: 70,
							transform: `translateY(${steamY3}px)`,
							opacity: steamOpacity3,
							fontSize: '2rem',
						}}
					>
						~
					</span>
				</div>

				<div className="bg-coffee-800 border-4 border-coffee-600 rounded-2xl px-12 py-8">
					<p className="text-4xl text-coffee-100 font-mono text-center">
						github.com/itsdevcoffee/
					</p>
					<p className="text-4xl text-coffee-100 font-mono text-center font-bold">
						devcoffee-agent-skills
					</p>
				</div>

				<p className="text-3xl text-coffee-200 mt-8">
					Start brewing better code today!
				</p>
			</div>
		</AbsoluteFill>
	);
};
