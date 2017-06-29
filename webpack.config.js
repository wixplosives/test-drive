const path = require('path');

module.exports = {
    devtool: 'eval',
    entry: {
        tests: ['core-js/shim', 'mocha-loader!./test/index.browser']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename: '[name].bundle.js',
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
    }
}
