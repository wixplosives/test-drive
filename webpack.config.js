const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        tests: ['core-js/shim', 'mocha-loader!./test/index.browser']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            declaration: false
                        }
                    }
                }
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'node_modules/chai-as-promised'),
                    path.resolve(__dirname, 'node_modules/chai-style')
                ],
                loader: 'ts-loader',
                options: {
                    // needed so it has a separate transpilation instance
                    instance: 'lib-compat',
                    transpileOnly: true
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
