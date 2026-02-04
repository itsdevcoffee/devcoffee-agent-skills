import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
// No setConcurrency - let Remotion auto-detect

// CRITICAL: Enable Tailwind CSS processing
Config.overrideWebpackConfig((config) => {
	return enableTailwind(config);
});
