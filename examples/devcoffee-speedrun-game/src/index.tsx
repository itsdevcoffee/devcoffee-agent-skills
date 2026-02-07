import {registerRoot} from 'remotion';
import {Composition} from 'remotion';
import './style.css';
import {GameMain} from './compositions/GameMain';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GameMain"
        component={GameMain}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
