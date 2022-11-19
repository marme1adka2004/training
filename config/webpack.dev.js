import FileIncludeWebpackPlugin from 'file-include-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";

import * as path from 'path';

const srcFolder = "src";
const builFolder = "dist";

const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(builFolder)
}
const config = {
	mode: "development",
	devtool: 'inline-source-map',
	optimization: {
		minimize: false
	},
	entry: [
		`${paths.src}/js/app.js`
	],
	output: {
		path: `${paths.build}`,
		filename: 'js/app.min.js',
		publicPath: '/'
	},
	devServer: {
		historyApiFallback: true,
		static: paths.build,
		open: true,
		compress: true,
		hot: false,
		port: 8080,
		devMiddleware: {
			writeToDisk: true
		}
	},
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				exclude: `${paths.src}/fonts`,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1,
							modules: false,
							url: {
								filter: (url, resourcePath) => {
									if (url.includes("img/") || url.includes("fonts/")) {
										return false;
									}
									return true;
								},
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						}
					},
				],
			},
		],
	},
	plugins: [
		new FileIncludeWebpackPlugin({
			source: srcFolder,
			htmlBeautifyOptions: {
				"indent-with-tabs": true,
				'indent_size': 3
			},
			replace: [{
				regex: '<link rel="stylesheet" href="css/style.min.css">',
				to: '',
			}],
		}),
		new CopyPlugin({
			patterns: [
				{
					from: `${srcFolder}/img`, to: `img`,
					noErrorOnMissing: true,
					force: true
				}, {
					from: `${srcFolder}/files`, to: `files`,
					noErrorOnMissing: true,
					force: true
				}
			],
		}),
	],
	resolve: {
		alias: {
			"SCSS": `${paths.src}/scss`,
			"JS": `${paths.src}/js`
		},
	},
}
export default config;