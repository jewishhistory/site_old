const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './tools/executors/content/impl.ts',
  target: "node",
  output: {
    filename: 'impl.js',
    path: path.resolve(__dirname, 'dist'),
    chunkFormat: 'commonjs',
    library: {
      type: "commonjs2",
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          'ts-loader',
        ],
      },
    ],
  },
};
