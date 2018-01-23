const webpack = require('webpack');
const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const scssSyntax = require('postcss-scss');
// const cssnano = require('cssnano');

module.exports = (env) => {
  const isProduction = env === 'production';

  console.log('env === "development" ', env === 'development');
  console.log('isProduction (env === "production") ', isProduction);
  console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

  return {
    entry: [
      // 'babel-polyfill', // can load specific core-js polyfills separately
      './src/index.jsx'
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/' // for webpack-dev-middleware
    },
    plugins: [
      new ExtractTextPlugin({
        // filename: '[name].css',
        filename: 'styles.css',
        allChunks: true,
        // inline loading in development is recommended for HMR and build speed
        disable: env === 'development' // OR:
        // disable: !isProduction
      }),
      // new UglifyJsPlugin({ // OR old webpack.optimize.UglifyJsPlugin
      //   sourceMap: true,
      //   parallel: true, // default === os.cpus().length -1
      // }),
      new webpack.DefinePlugin({
        'process.env': {
          // looks like not needed anymore if -p flag was used
          NODE_ENV: JSON.stringify(env)
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
                // useBuiltIns: 'usage', // or 'usage' | 'entry'
                debug: true
              }],
              'react',
              'stage-3'
            ]
          }
        },
        {
          test: /\.(scss|css)$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader',
                options: { importLoaders: 2, sourceMap: true }
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
              { loader: 'sass-loader', options: { sourceMap: true } }
            ],
            fallback: 'style-loader'
          })
        }
      ]
    },
    devServer: {
      progress: true,
      contentBase: path.resolve(__dirname, 'public'),
      compress: true,
      historyApiFallback: true
      // port: 9000,
    },
    // devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map'
    devtool: 'source-map'
  };
};
