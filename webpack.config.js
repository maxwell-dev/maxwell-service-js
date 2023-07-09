const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, "examples", "hello.ts"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  performance: { hints: false },
  resolve: {
    extensions: [".js", ".ts", ".json"],
  },
  target: "node",
};
