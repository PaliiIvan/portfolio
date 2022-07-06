const path = require('path');
const HtmlLoader = require('html-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

/**
 * @type {import ('webpack').Configuration }
 */
const conf = {
    entry: './src/index.js',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true,
        watchFiles: ['src/**/*'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
        publicPath: ''
    },
    plugins: [
        new HtmlLoader({ template: './src/index.html', title: 'Webpack test' }),
        new WebpackManifestPlugin(),
        new CopyPlugin({
            patterns: [
                { from: './src/public/', to: 'public' }
            ]
        }),
        new MiniCSSExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", 'sass-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg|png|jpg|jpeg)$/i,
                type: 'asset',
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            // CSS
            {
                test: /\.scss$/,
                use:
                    [
                        MiniCSSExtractPlugin.loader,
                        'css-loader'
                    ]
            },
        ]
    }
}


module.exports = conf