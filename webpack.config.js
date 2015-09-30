'use strict';

var webpack           = require('webpack'),
    CleanPlugin       = require('clean-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlPlugin        = require('html-webpack-plugin'),
    ESManglePlugin    = require('esmangle-webpack-plugin'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
    OmitTildePlugin   = require('omit-tilde-webpack-plugin');

function config() {

    // define Webpack configuration object to be exported
    return {
        context: __dirname,
        cache  : true,
        devtool: 'source-map',
        entry  : {
            vendor: Object.keys(require('./bower.json').dependencies),
            index : [
                './app/index.js',
                './app/index.scss'
            ]
        },
        output : {
            path                                 : __dirname + '/app-build',
            filename                             : 'assets/index.[hash].js',
            devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
            devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
        },
        resolve: {
            alias: {
                npm: __dirname + '/node_modules'
            },
            root : __dirname + '/bower_components'
        },
        module : {
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
                        'css?minimize&sourceMap!resolve-url?sourceMap!sass'
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
                    include: /bower_components/,
                    loader : 'ng-annotate?sourceMap'
                }, {
                    test   : /\.js$/,
                    exclude: /bower_components/,
                    loaders: [
                        'nginject?sourceMap',
                        'ng-annotate?sourceMap',
                        'babel?stage=4&sourceMap&ignore=buffer' // https://github.com/feross/buffer/issues/79
                    ]
                }, {
                    test  : /\.html?$/,
                    loader: 'html'
                }, {
                    test  : /\.json$/,
                    loader: 'json'
                }
            ]
        },
        plugins: [
            new CleanPlugin(['app-build']),
            new OmitTildePlugin({
                include  : ['package.json', 'bower.json'],
                deprecate: true
            }),
            new webpack.ResolverPlugin([
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
            ]),
            new webpack.ProvidePlugin({
                $     : 'jquery',
                jQuery: 'jquery'
            }),
            new ExtractTextPlugin('assets/[name].[contenthash].css', {
                allChunks: true
            }),
            new webpack.optimize.CommonsChunkPlugin(['vendor'], 'assets/vendor.[hash].js'),
            new HtmlPlugin({
                title   : 'Custom template',
                template: __dirname + '/app/index.html',
                inject  : 'body'
            }),
            new webpack.optimize.DedupePlugin(),
            new ESManglePlugin(),
            new BrowserSyncPlugin({
                host  : 'localhost',
                port  : 55555,
                server: {
                    baseDir: ['app-build'],
                    routes : ['/']
                }
            })
        ]
    };
}

module.exports = config();