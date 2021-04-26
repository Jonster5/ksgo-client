import svelte from '@sveltejs/vite-plugin-svelte';
import alias from '@rollup/plugin-alias';
import path from 'path';

const projectRootDir = path.resolve(__dirname);

const config = {
	// resolve: {
	// 	alias: aliases,
	// },
	plugins: [
		svelte(),
		alias({
			entries: [
				{
					find: '@assets',
					replacement: path.resolve(projectRootDir, 'src/assets'),
				},
				{
					find: '@components',
					replacement: path.resolve(projectRootDir, 'src/components'),
				},
				{
					find: '@lib',
					replacement: path.resolve(projectRootDir, 'src/lib'),
				},
				{
					find: '@data',
					replacement: path.resolve(projectRootDir, 'src/data'),
				},
				{
					find: '@styles',
					replacement: path.resolve(projectRootDir, 'src/styles'),
				},
			],
		}),
	],
	server: {
		port: 5000,
	},
};

export default config;
