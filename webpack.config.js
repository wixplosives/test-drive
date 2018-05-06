const path = require('path');

module.exports = {
    mode: 'development',
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
                    path.join(__dirname, 'node_modules', 'chai-as-promised'),
                    path.join(__dirname, 'node_modules' ,'chai-style')
                ],
                loader: 'ts-loader',
                options: {
                    instance: 'lib-compat', // needed so it has a separate transpilation instance
                    transpileOnly: true
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    }
}
