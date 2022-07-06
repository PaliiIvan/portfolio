const path = require('path');
const HtmlLoader = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge');
const commonConf = require('./webpack.config.common');


/**
 * @type {import ('webpack').Configuration }
 */
const conf = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true,
        watchFiles: ['src/**/*'],
    },
    plugins: [
        new WebpackManifestPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", 'sass-loader'],
            }
        ]
    }
}


module.exports = merge(conf, commonConf)