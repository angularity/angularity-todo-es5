var webpack           = require('webpack'),
    CleanPlugin       = require('clean-webpack-plugin'),
    NgAnnotatePlugin  = require('ng-annotate-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

function config() {
    'use strict';

    // define Webpack configuration object to be exported
    return {
        context : __dirname,
        entry   : './app/index.js',
        devtools: 'inline-source-map',
        output  : {
            path    : __dirname + '/app-build',
            filename: 'index.js'
        },
        resolve : {
            alias: {
                'npm': __dirname + '/node_modules'
            },
            root : __dirname + '/bower_components'
        },
        module  : {
            preloaders: [
                {
                    test   : /\.js?$/,
                    exclude: './node_modules',
                    loader : 'jshint'
                }
            ],
            loaders   : [
                {
                    test  : /\.css$/,
                    loader: ExtractTextPlugin.extract(
                        'style',
                        'css?minimize&sourceMap!resolve-url?sourceMap'
                    )
                }, {
                    test  : /\.scss$/,
                    loader: ExtractTextPlugin.extract(
                        'style',
                        'css?minimize&sourceMap!resolve-url?sourceMap!sass?sourceMap'
                    )
                }, {
                    test   : /\.(jpe?g|png|gif|svg)$/i,
                    loaders: [
                        'file?hash=sha512&digest=hex&name=/assets/[hash].[ext]',
                        'image-webpack?optimizationLevel=7&interlaced=false'
                    ]
                }, {
                    test  : /\.woff2?$/,
                    loader: 'url?limit=10000&mimetype=application/font-woff&name=/assets/[hash].[ext]'
                }, {
                    test  : /\.(eot|ttf)$/,
                    loader: 'file?name=/assets/[hash].[ext]'
                }, {
                    test   : /\.js$/,
                    exclude: /bower_components/,
                    loaders: [
                        'babel?stage=4?sourceMap',
                        'ng-annotate?sourceMap'
                    ]
                }, {
                    test  : /\.html?$/,
                    loader: 'html'
                }
            ]
        },
        plugins : [
            new CleanPlugin(['app-build']),
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(
                    'bower.json', ['main']
                )
            ),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new ExtractTextPlugin('index.css'),
            new HtmlWebpackPlugin({
                title   : 'Custom template',
                template: __dirname + '/app/index.html',
                inject  : 'body'
            })
        ]
    };
}

module.exports = config();