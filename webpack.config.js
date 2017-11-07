const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const scssSyntax = require('postcss-scss');
// const cssnano = require('cssnano');

const nodeEnv = JSON.stringify(process.env.NODE_ENV || 'development');
// const isProd = nodeEnv === 'production';

module.exports = {
  entry: [
    // 'babel-polyfill', // TODO: enable later or load needed core-js modules
    './src/index.jsx'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'bower_components')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env', 'stage-3'] // TODO: add stage-3 or 2 later
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
  devtool: 'source-map'
};
