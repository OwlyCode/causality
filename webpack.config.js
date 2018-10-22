var path = require('path');

module.exports = {
    // Change to your "entry-point".
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, and js files.
            test: /\.(tsx?)|(js)$/,
            exclude: /node_modules/,
            loader: ['babel-loader', 'ts-loader'],
        }],
    },
    devServer: {
        open: true, // Open the page in browser
    },
    optimization: {
        minimize: false,
    }
};
