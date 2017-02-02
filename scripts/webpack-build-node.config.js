var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, '../../src/promise-sequences.js'),
    target: 'node',
    output: {
        path: path.join(__dirname, '../../build'),
        filename: 'promise-sequences.commonjs.js',
        libraryTarget: 'commonjs'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
        ],
    },
    devtool: 'source-map',
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.BannerPlugin('require("source-map-support").install();',
            {raw: true, entryOnly: false}),
    ],
}