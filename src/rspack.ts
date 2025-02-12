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
		entry,
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
					test: /.ts?$/,
					use: [
						{
							loader: 'ts-loader',
							options: {
								context: tscontext,
								transpileOnly: true,
								projectReferences: true,
								reportFiles: ['*.ts'],
								happyPackMode: true,
								onlyCompileBundledFiles: true,
								experimentalWatchApi: true,
								compilerOptions: {
									module: 'esnext',
									target: 'es2015'
								}
							},
						},
					],
				},
				{
					test: /\.tsx$/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								cacheDirectory: true,
								plugins: [
									'@babel/plugin-syntax-jsx',
									[
										'@babel/plugin-transform-react-jsx',
									],
									[
										'babel-plugin-styled-components',
										{
											displayName: true,
											fileName: true,
											meaninglessFileNames: [
												'index',
												'styles',
												'styledComponents',
											],
										},
									],
								],
							},
						},
						{
							loader: 'ts-loader',
							options: {
								transpileOnly: true,
							},
						},
					],
				},
				{
					test: /\.ts$/,
					use: ['source-map-loader'],
					enforce: 'pre',
				},
				{
					test: /\.js$/,
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
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'styles/[name].css',
							},
						},
						{
							loader: 'extract-loader',
						},
						{
							loader: 'css-loader?-url',
							options: {
								url: false,
								sourceMap: true,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
								plugins: () => [autoprefixer()],
							},
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
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
			extensions: ['.ts', '.tsx', '.js'],
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