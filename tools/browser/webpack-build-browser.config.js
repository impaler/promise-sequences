var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, '../../src/promise-sequences.js'),
    output: {
        path: path.join(__dirname, '../../build'),
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
    devtool: 'source-map',
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })
    ],
}