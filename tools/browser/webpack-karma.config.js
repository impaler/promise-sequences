var path = require('path');
var testContext = '../tests.context.js'

module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS', 'Chrome'],
        // browsers: ['PhantomJS'],
        // browsers: ['Chrome'],
        files: [
            '../../node_modules/babel-polyfill/dist/polyfill.js', // phantomjs doesn't have promise
            testContext,
        ],
        frameworks: [
            'jasmine',
        ],
        preprocessors: {
            [testContext]: ['webpack', 'sourcemap'],
        },
        reporters: ['progress'],
        webpack: {
            cache: true,
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        loader: 'babel-loader'
                    }
                ],
            },
        },
    });
};