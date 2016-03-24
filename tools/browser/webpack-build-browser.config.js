var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, '../../src/promise-sequences.js'),
    output: {
        path: path.join(__dirname, '../../build'),
        filename: 'promise-sequences.umd.min.js',
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
    devtool: 'source-map',
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        // new webpack.BannerPlugin('require("source-map-support").install();', {raw: true, entryOnly: false}),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })
    ],
}