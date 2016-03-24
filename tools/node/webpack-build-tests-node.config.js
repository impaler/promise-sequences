var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, '../tests.context.js'),
    target: 'node',
    output: {
        path: path.resolve(__dirname, '../../build'),
        filename: 'promise-sequences.specs.js',
        libraryTarget: 'umd'
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