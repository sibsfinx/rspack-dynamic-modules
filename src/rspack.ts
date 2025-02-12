import { Configuration } from '@rspack/core';
import autoprefixer from 'autoprefixer';

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
	return {
		mode,
		entry,
		devtool: mode === 'development' ? 'eval-source-map' : 'source-map',
		output: {
			publicPath,
			path: distPath,
			filename: '[name].js',
			library: 'App',
			libraryTarget: 'var',
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
			moduleIds: 'named',
			chunkIds: 'named',
			minimize: mode === 'production',
			sideEffects: true,
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
		},
		plugins,
	};
}