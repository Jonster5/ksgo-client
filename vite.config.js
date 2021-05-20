import svelte from '@sveltejs/vite-plugin-svelte';
import path from 'path';

const projectRootDir = path.resolve(__dirname);

/**
 * @type {import('vite').UserConfig}
 */
const config = {
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.resolve(projectRootDir, '.'),
			},
			{
				find: '@assets',
				replacement: path.resolve(projectRootDir, 'src/assets'),
			},
			{
				find: '@components',
				replacement: path.resolve(projectRootDir, 'src/components'),
			},
			{
				find: '@api',
				replacement: path.resolve(projectRootDir, 'src/lib/api'),
			},
			{
				find: '@data',
				replacement: path.resolve(projectRootDir, 'src/lib/data'),
			},
			{
				find: '@utils',
				replacement: path.resolve(projectRootDir, 'src/lib/utils'),
			},
			{
				find: '@classes',
				replacement: path.resolve(projectRootDir, 'src/lib/classes'),
			},
			{
				find: '@styles',
				replacement: path.resolve(projectRootDir, 'src/styles'),
			},
		],
	},
	plugins: [svelte()],
	server: {
		port: 5000,
	},
};

export default config;
