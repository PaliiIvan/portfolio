const path = require('path');
const HtmlLoaderPlugin = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

/**
 * @type {import ('webpack').Configuration }
 */
const conf = {
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
        clean: true,
        publicPath: ''
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './src/public/', to: 'public' }
            ]
        }),
        new HtmlLoaderPlugin({ template: './src/index.html', inject: 'body' }),
    ],
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|svg|otf|png|jpg|jpeg)$/i,
                exclude: /\.m.svg$/,
                type: 'asset',
            },
            {
                test: /\.m.svg$/,
                loader: 'svg-inline-loader'
            },
        ]
    }
}


module.exports = conf