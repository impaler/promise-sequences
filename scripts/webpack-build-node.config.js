const path = require('path')
const webpack = require('webpack')
const DEVELOPMENT = process.env.DEV

let webpackConfig = {
    entry: path.join(__dirname, '../src/promise-sequences.js'),
    target: 'node',
    output: {
        path: path.join(__dirname, '../build'),
        filename: 'promise-sequences.js',
        libraryTarget: 'commonjs'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
        ],
    }
}

if (DEVELOPMENT) {
  webpackConfig = Object.assign(webpackConfig, {
    devtool: 'source-map',
    plugins: [
      new webpack.BannerPlugin('require("source-map-support").install();',
        {raw: true, entryOnly: false}),
    ]
  })
}

module.exports = webpackConfig
