import { Configuration } from '@rspack/core';
import autoprefixer from 'autoprefixer';
import path from 'path';

// Add configuration parameters
interface RspackConfigParams {
	context: string;
	entry: Record<string, string>;
	publicPath: string;
	distPath: string;
	tscontext: string;
	mode: 'development' | 'production';
	plugins: any[];
	sourceMaps?: boolean;
}

export function createRspackConfig({
	context,
	entry,
	publicPath,
	distPath,
	tscontext,
	mode,
	plugins,
	sourceMaps = true,
}: RspackConfigParams): Configuration {
	const isDev = mode === 'development';

	return {
		mode,
		entry: {
			scripts: './src/index.tsx',  // Main React entry point
			styles: './src/styles/app.scss'  // SCSS entry point
		},
		devtool: isDev ? 'eval-source-map' : 'source-map',
		// Enable caching
		// cache: {
		//     type: 'filesystem',
		//     buildDependencies: {
		//         config: [__filename],
		//     },
		//     name: isDev ? 'dev-cache' : 'prod-cache',
		// },
		output: {
			publicPath,
			path: distPath,
			filename: isDev ? '[name].js' : '[name].[contenthash].js',
			library: 'App',
			libraryTarget: 'var',
			// Clean output directory between builds
			clean: true,
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								cacheDirectory: true,
								presets: [
									'@babel/preset-env',
									'@babel/preset-react',
									'@babel/preset-typescript'
								],
								plugins: [
									'@babel/plugin-syntax-jsx',
									'@babel/plugin-transform-react-jsx',
									'babel-plugin-styled-components'
								],
							},
						},
					],
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								plugins: ['@babel/plugin-proposal-export-namespace-from'],
							},
						},
						{ loader: 'source-map-loader' },
					],
					enforce: 'pre',
				},
				{
					test: /\.html$/,
					use: ['file-loader?name=[name].[ext]'],
				},
				{
					test: /\.(woff2|woff|eot|ttf|otf)$/,
					use: ['file-loader'],
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif)$/,
					use: ['file-loader?name=images/[name].[ext]&esModule=false'],
				},
				{
					test: /\.scss$/,
					type: 'css',
					use: [
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [autoprefixer()],
								},
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
								api: 'modern',
								implementation: require.resolve('sass'),
								sassOptions: {
									outputStyle: isDev ? 'expanded' : 'compressed',
								},
							},
						},
					],
				},
			],
		},
		optimization: {
			moduleIds: isDev ? 'named' : 'deterministic',
			chunkIds: isDev ? 'named' : 'deterministic',
			minimize: !isDev,
			sideEffects: true,
			usedExports: true,
			innerGraph: true,
			splitChunks: {
				chunks: 'all',
				minSize: 20000,
				minChunks: 1,
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
					common: {
						name: 'common',
						minChunks: 2,
						chunks: 'all',
						priority: -20,
					},
				},
			},
			// Optimize module concatenation
			concatenateModules: true,
			// Extract runtime code into a separate chunk
			runtimeChunk: {
				name: 'runtime',
			},
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.scss'],
			// Add module aliases
			alias: {
				'@utils': path.resolve(context, 'src/utils'),
				'@components': path.resolve(context, 'src/components'),
			},
			// Restrict module search paths
			modules: ['node_modules'],
			// Prefer module field in package.json
			mainFields: ['module', 'main'],
		},
		plugins,
		// Development server options
		devServer: isDev ? {
			hot: true,
			compress: true,
			historyApiFallback: true,
			client: {
				overlay: true,
			},
		} : undefined,
	};
}