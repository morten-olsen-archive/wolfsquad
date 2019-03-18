import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: Configuration = {
  entry: {
    app: path.join(__dirname, 'src/index.ts'),
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.tsx?/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/env', '@babel/react', '@babel/typescript'],
      },
    }],
  },
};

export default config;