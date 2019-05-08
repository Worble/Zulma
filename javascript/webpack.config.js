const path = require('path');

module.exports = {
    entry: {
        zulma_navbar: './src/zulma_navbar.js',
        zulma_search: './src/zulma_search.js',
        zulma_switchcss: './src/zulma_switchcss.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('../static/js')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: ["babel-loader", "eslint-loader"]
        }]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    mode: 'production',
};