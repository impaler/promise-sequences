var path = require('path');
var webpack = require('webpack');
const DEVELOPMENT = process.env.DEV

let webpackConfig = {
    entry: path.join(__dirname, '../src/promise-sequences.js'),
    output: {
        path: path.join(__dirname, '../build'),
        filename: 'promise-sequences.umd.min.js',
        library: 'sequences',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })
    ],
}

if (DEVELOPMENT) {
  webpackConfig = Object.assign(webpackConfig, {
    devtool: 'source-map',
  })
}

module.exports = webpackConfig
