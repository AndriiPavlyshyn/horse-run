const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
	configureWebpack: {
		resolve: {
			extensions: ['.ts', '.js', '.vue']
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					loader: 'ts-loader',
					options: {
						appendTsSuffixTo: [/\.vue$/],
						transpileOnly: true
					},
					exclude: /node_modules/
				}
			]
		},
		plugins: [
			new ForkTsCheckerWebpackPlugin()
		]
	}
}
