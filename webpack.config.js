const webpack = require('webpack');
const path = require('path');
// const HTMLWebpackPlugin = require('html-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const scssSyntax = require('postcss-scss');
// const cssnano = require('cssnano');

module.exports = (env) => {
  const isProduction = env === 'production';

  console.log('env === "development" ', env === 'development');
  console.log('isProduction (env === "production") ', isProduction);
  console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

  return {
    mode: env || 'development',
    entry: {
      bundle: isProduction
        ? ['babel-polyfill',
          // 'normalize.css/normalize.css',
          // './src/styles/index.scss',
          './src/index.jsx']
        : './src/index.jsx'
    },
    output: {
      filename: '[name].js', // 'js/[name].js'; [name].[chunkhash].js in PROD
      path: path.resolve(__dirname, 'public'),
      publicPath: '/'
    },
    plugins: [
      // new ExtractTextPlugin({
      //   filename: getPath => (
      //     getPath('[name].css').replace('bundle', 'styles') // 'css/styles'
      //   ),
      //   allChunks: true,
      //   // inline loading in development is recommended for HMR and build speed
      //   disable: true // env === 'development' // OR:
      //   // disable: !isProduction
      // }),
      // new UglifyJsPlugin({ // OR old webpack.optimize.UglifyJsPlugin
      //   sourceMap: true,
      //   parallel: true, // default === os.cpus().length -1
      // }),
      new webpack.DefinePlugin({
        'process.env': {
          // looks like not needed anymore if -p flag was used
          NODE_ENV: JSON.stringify(env)
        }
      }),
      new CleanWebpackPlugin(
        ['public'], // OR 'build' OR 'dist', removes folder
        { exclude: ['index.html'] }
      )
      // new HTMLWebpackPlugin({
      //   title: 'Lil Chat',
      //   favicon: 'src/assets/favicon.png'
      //   // filename: 'assets/custom.html'
      //   // append webpack compilation hash to all included js and css files,
      //   // hash: true // usefull for cache busting
      // })
    ],
    resolve: {
      alias: {
        App: path.resolve(__dirname, 'src/components/App.jsx'),
        Components: path.resolve(__dirname, 'src/components'),
        Utilities: path.resolve(__dirname, 'src/utils')
      },
      modules: [
        // TODO: add "src/components", e.t.c
        path.resolve(__dirname, 'src/components'),
        path.resolve(__dirname, 'src'),
        'node_modules'
      ],
      extensions: ['.js', '.json', '.jsx', '*']
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
                // modules: false,
                // useBuiltIns: 'usage', // OR 'entry'
                debug: true
              }],
              'react',
              'stage-3'
            ]
          }
        },
        {
          test: /\.(scss|css)$/,
          // TODO: add include here ?
          include: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'node_modules')
          ],
          use: [
            { loader: 'style-loader', options: { sourceMap: true } },
            { // not translates url() that starts with "/"
              loader: 'css-loader',
              options: {
                importLoaders: 3,
                // url: false, // enable/disable url() resolving
                // minimize: true, // OR { /* cssnano config */ } OR w postcss
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
            // w/o it css-loader can only resolve url() relative to index.scss
            // 'resolve-url-loader',
            { loader: 'sass-loader', options: { sourceMap: true } }
          ]
          // use: ExtractTextPlugin.extract({
          //   use: [
          //     { // not translates url() that starts with "/"
          //       loader: 'css-loader',
          //       options: {
          //         importLoaders: 3,
          //         // url: false, // enable/disable url() resolving
          //         // minimize: true, // OR { /* cssnano config */ } OR w postcss
          //         sourceMap: true
          //       }
          //     },
          //     {
          //       loader: 'postcss-loader',
          //       options: {
          //         ident: 'postcss',
          //         syntax: scssSyntax,
          //         plugins: [
          //           autoprefixer
          //           // cssnano
          //         ],
          //         sourceMap: true
          //       }
          //     },
          //     // w/o it css-loader can only resolve url() relative to index.scss
          //     // 'resolve-url-loader',
          //     { loader: 'sass-loader', options: { sourceMap: true } }
          //   ],
          //   fallback: 'style-loader'
          // })
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          // TODO: add include here ?
          include: path.resolve(__dirname, 'src'),
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]', // '[name].[hash].[ext]'
                outputPath: 'assets/img/' // custom output path
              }
            }
            // {
            //   loader: 'image-webpack-loader',
            //   query: {
            //     progressive: true,
            //     optimizationLevel: 7,
            //     interlaced: false,
            //     pngquant: {
            //       quality: '65-90',
            //       speed: 4
            //     }
            //   }
            // }
          ]
        }
        // {
        //   test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        //   loader: 'url-loader',
        //   options: {
        //     limit: 10000
        //   }
        // }
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
