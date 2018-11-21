const path = require("path");

module.exports = {
	entry: "./index.js",
	mode: "production",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	watch: true,

	node: {
		fs: "empty"
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"/*,'@babel/preset-react'*/]
					}
				}
			}
		]
	},
};