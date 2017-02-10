var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./app/ts/App.tsx",
    output: {
        filename: "./app/App.js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loaders: ['ts-loader'] },
            {
                test: /(file-type).*\.js$/,
                loader: 'babel-loader',

                query: {
                    presets: ['es2015', 'stage-0']
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['url-loader', 'img-loader']
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            }
        ]
    },
    devtool: process.env.NODE_ENV === 'production' ? false : "source-map",
    target: 'electron',
    // plugins: [new webpack.optimize.UglifyJsPlugin({
    //         beautify: false,
    //         compress: {
    //             warnings: false,
    //             drop_console: true,
    //             drop_debugger: true
    //         },
    //         comments: false
    //     })]
    plugins: (function() {
        var plugins = [];
        if (process.env.NODE_ENV === 'production') {
            plugins.push(new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                compress: {
                    warnings: false,
                    drop_console: true,
                    drop_debugger: true
                },
                comments: false
            }));
        }
        return plugins;
    }())
};