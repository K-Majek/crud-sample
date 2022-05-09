const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");


module.exports = {
    entry: path.join(__dirname, "views", "index.js"),
    output: {
        path: path.join(__dirname, "views"),
        filename: 'bundle.js'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(__dirname, "views", "index.html")
        })
    ],
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /(node_modules)|(tools)|(routes)|(public)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    devServer: {
        port: 80
    }
}