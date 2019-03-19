import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SriPlugin from 'webpack-subresource-integrity';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const production = process.env.NODE_ENV === 'production';

const config: Configuration = {
  entry: {
    app: [
      '@babel/polyfill',
      path.join(__dirname, 'src/'),
    ],
  },
  mode: production ? 'production' : 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash:6].js',
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: process.env.NODE_ENV === 'production',
    }),
    // new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [{
      test: /\.tsx?/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/env', {}],
          '@babel/react',
          '@babel/typescript',
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-syntax-dynamic-import',
        ],
      },
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    }],
  },
};

export default config;