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
					replacement: path.resolve(
						projectRootDir,
						'src/lib/classes'
					),
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
