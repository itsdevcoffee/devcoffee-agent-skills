import {Composition} from 'remotion';
import {Main} from './compositions/Main';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Main"
				component={Main}
				durationInFrames={150} // 5 seconds at 30fps (quick test)
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
