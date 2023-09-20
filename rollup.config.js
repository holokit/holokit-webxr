import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
	input: 'src/api/index.ts',
	output: {
		file: './dist/holokit-webxr-polyfill.js',
		format: 'es',
		name: 'HoloKitWebXRPolyfill',
	},
	plugins: [
        typescript(),
		resolve(),
		commonjs(),
	],
};
