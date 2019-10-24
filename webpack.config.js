const path = require("path");

module.exports = {
  entry: "./grafokres.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "grafokres.js",
    library: "grafokres",
    libraryTarget: "umd",
  },
  watch: true,

  node: {
    fs: "empty",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
