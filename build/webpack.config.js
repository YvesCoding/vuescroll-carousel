'use strict';

var webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var extractCss = new ExtractTextPlugin('[name].css');
var StringReplacePlugin = require('string-replace-webpack-plugin');

const version = process.env.VERSION || require('../package.json').version;

var plugins = [
  new StringReplacePlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  extractCss,
  // Compress extracted CSS. We are using this plugin so that possible
  // duplicated CSS from different components can be deduped.
  new OptimizeCSSPlugin({
    cssProcessorOptions: {
      safe: true
    }
  })
];

// if (process.env.NODE_ENV === 'production') {
//   plugins.push(
//     new UglifyJSPlugin({
//       test: /\.js/i
//     })
//   );
// }

module.exports = {
  externals: {
    'vuescroll/dist/vuescroll-slide': {
      root: 'vuescroll',
      commonjs2: 'vuescroll/dist/vuescroll-slide',
      commonjs: 'vuescroll/dist/vuescroll-slide',
      amd: 'vuescroll/dist/vuescroll-slide'
    },
    'vuescroll/dist/vuescroll.css': {
      commonjs2: 'vuescroll/dist/vuescroll.css',
      commonjs: 'vuescroll/dist/vuescroll.css',
      amd: 'vuescroll/dist/vuescroll.css'
    },
    vue: {
      root: 'Vue',
      commonjs2: 'vue',
      commonjs: 'vue',
      amd: 'vue'
    }
  },
  module: {
    loaders: [
      {
        test: /\.(jsx?|babel|es6)$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /index\.js/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /__version__/gi,
              replacement: function(match, p1, offset, string) {
                return `'${version}'`;
              }
            }
          ]
        }),
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader'
                },
                {
                  loader: 'sass-loader'
                },
                {
                  loader: 'postcss-loader'
                }
              ]
            }),
            scss: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader'
                },
                {
                  loader: 'sass-loader'
                }
              ]
            })
          },
          extract: true
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      },
      {
        test: /\.otf|ttf|woff2?|eot(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      },
      {
        test: /\.(gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /(\.css|\.scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      }
    ]
  },
  entry: {
    index: [path.resolve(__dirname, '../src/index.js')]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'index.js',
    chunkFilename: '[id].js',
    library: 'vuescroll-carousel',
    libraryTarget: 'umd'
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.vue']
  }
};
