const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplPkgCheckrPlugin = require('duplicate-package-checker-webpack-plugin');
// const BabelPluginTransformImports = require('babel-plugin-transform-imports');
// const CompressionPlugin = require('compression-webpack-plugin');
// const VisualizerPlugin = require('webpack-visualizer-plugin');
const autoprefixer = require('autoprefixer');
// const scssSyntax = require('postcss-scss');
// const cssnano = require('cssnano');

process.traceDeprecation = true; // or run process with --trace-deprecation flag

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

console.log('env: ', env);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

module.exports = {
  mode: env,
  entry: {
    // polyfills: './src/config/polyfills.js',
    bundle: [
      // 'normalize.css/normalize.css',
      // 'sanitize.css/sanitize.css',
      // './src/styles/index.scss',
      './src/config/polyfills.js',
      './src/index.jsx',
    ],
  },
  output: {
    filename: isProduction ? 'js/[name].[chunkhash].js' : '[name].js',
    chunkFilename: isProduction ? 'js/[name].[chunkhash].js' : '[id].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  optimization: {
    minimizer: [ // setting this overrides webpack 4 defaults
      new UglifyJSPlugin({
        cache: true,
        parallel: 2, // if "true": os.cpus().length -1 (default)
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
    },
    // splitChunks: {
    //   cacheGroups: {
    //     styles: { // to extract css to one file
    //       name: 'styles',
    //       test: /\.css$/,
    //       chunks: 'all',
    //       enforce: true
    //     }
    //   }
    // }
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProduction ? 'css/styles.[contenthash].css' : '[name].css',
      chunkFilename: isProduction ? 'css/[name].[contenthash].css' : '[id].css',
    }),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify(env)
    //   },
    // }),
    new CleanWebpackPlugin(
      ['public'], // OR 'build' OR 'dist', removes folder
      { exclude: ['index.html'] },
    ),
    new HTMLWebpackPlugin({
      title: 'Local Chat',
      favicon: 'src/assets/favicon.png',
      // meta: {
      //   viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      // },
      inject: false,
      template: './src/assets/template.html',
      appMountId: 'app',
      mobile: true,
      // filename: 'assets/custom.html',
      // hash: true, // usefull for cache busting
    }),
    // new CompressionPlugin({
    //   deleteOriginalAssets: true,
    //   test: /\.js/
    // }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new DuplPkgCheckrPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new VisualizerPlugin(),
    ...isProduction ? [] : [new webpack.HotModuleReplacementPlugin()],
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      containers: path.resolve(__dirname, 'src/containers'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      actions: path.resolve(__dirname, 'src/actions'),
      constants: path.resolve(__dirname, 'src/constants'),
      utils: path.resolve(__dirname, 'src/utils'),
    },
    modules: [
      path.resolve(__dirname, 'src/components'),
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.js', '.json', '.jsx', '*'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
        options: {
          // TODO: "transform-imports" (babel-plugin-transform-imports)
          plugins: [
            'react-hot-loader/babel',
            // 'fast-async',
            'syntax-dynamic-import',
            'transform-class-properties',
          ].concat(isProduction ? [] : ['transform-react-jsx-source']),
          presets: [
            ['env', {
              // modules: false,
              // useBuiltIns: 'usage', // OR 'entry'
              debug: true,
              targets: {
                browsers: ['last 2 versions'],
              },
              exclude: [/* plugins to exlude */],
            }],
            'react',
            'stage-3',
          ],
          cacheDirectory: true,
        },
      },
      {
        test: /\.(scss|css)$/, // OR /\.s?[ac]ss$/,
        // TODO: consider to replace by more specific include's
        include: [
          // path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'src/styles'),
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'node_modules'),
        ],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          { // not translates url() that starts with "/"
            loader: 'css-loader',
            // options: { importLoaders: 3, url: false }
            options: { minimize: true, sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              // syntax: scssSyntax,
              plugins: [autoprefixer],
              sourceMap: true,
            },
          },
          // 'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        // TODO: consider to remove include
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isProduction ? '[name].[hash].[ext]' : '[name].[ext]',
              // outputPath: 'assets/', // custom output path
              useRelativePath: true, // isProd
            },
          },
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
        ],
      },
      // {
      //   test: /\.(scss|css)$/,
      //   // TODO: add include here ?
      //   include: [
      //     path.resolve(__dirname, 'src'),
      //     path.resolve(__dirname, 'node_modules')
      //   ],
      //   use: ExtractTextPlugin.extract({
      //     use: [
      //       { // not translates url() that starts with "/"
      //         loader: 'css-loader',
      //         options: {
      //           importLoaders: 3,
      //           // url: false, // enable/disable url() resolving
      //           // minimize: true, // OR { /* cssnano config */ } OR w postcss
      //           sourceMap: true
      //         }
      //       },
      //       {
      //         loader: 'postcss-loader',
      //         options: {
      //           ident: 'postcss',
      //           syntax: scssSyntax,
      //           plugins: [
      //             autoprefixer
      //             // cssnano
      //           ],
      //           sourceMap: true
      //         }
      //       },
      //       // w/o it css-loader can only resolve url() relative to index.scss
      //       // 'resolve-url-loader',
      //       { loader: 'sass-loader', options: { sourceMap: true } }
      //     ],
      //     fallback: 'style-loader'
      //   })
      // },
      // {
      //   test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000
      //   }
      // }
    ],
  },
  devServer: {
    progress: true,
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    // port: 9000,
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
};
