const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const scssSyntax = require('postcss-scss');
// const cssnano = require('cssnano');

const nodeEnv = JSON.stringify(process.env.NODE_ENV || 'development');
// const isProd = nodeEnv === 'production';

module.exports = {
  entry: [
    // 'babel-polyfill', // NOTE: can load specific core-js polyfills separately
    './src/index.jsx'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/' // for webpack-dev-middleware
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: nodeEnv
      }
    })
  ],
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src/components/App.jsx')
    },
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: ['.js', '.json', '.jsx', '.css', '.scss', '*']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        options: {
          plugins: ['transform-class-properties'],
          presets: [
            ['env', {
              // useBuiltIns: 'entry', // or 'usage'
              debug: true
            }],
            'react',
            'stage-3'
          ]
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              syntax: scssSyntax,
              plugins: [
                autoprefixer
                // postcss-normalize,
                // cssnano
              ],
              sourceMap: true
            }
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [
                path.resolve(__dirname, 'src/styles')
              ]
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    historyApiFallback: true
    // port: 9000,
  },
  devtool: 'source-map'
};
