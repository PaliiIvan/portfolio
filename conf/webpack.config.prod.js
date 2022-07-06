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
    entry: './src/index.js',
    mode: 'production',
    plugins: [
        new MiniCSSExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [MiniCSSExtractPlugin.loader, "css-loader", 'sass-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|png|jpg|jpeg)$/i,
                type: 'asset',
            }
        ]
    }
}


module.exports = merge(conf, commonConf)