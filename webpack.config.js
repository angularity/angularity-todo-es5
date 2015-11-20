'use strict';

var path = require('path');

var webpack            = require('webpack'),
    CleanPlugin        = require('clean-webpack-plugin'),
    ExtractTextPlugin  = require('extract-text-webpack-plugin'),
    HtmlPlugin         = require('html-webpack-plugin'),
    ESManglePlugin     = require('esmangle-webpack-plugin'),
    BrowserSyncPlugin  = require('browser-sync-webpack-plugin'),
    BowerWebpackPlugin = require('bower-webpack-plugin'),
    OmitTildePlugin    = require('omit-tilde-webpack-plugin');

function bowerModules(bowerFilePath) {
    var json = require(path.resolve(bowerFilePath));
    return json.dependencies && Object.keys(json.dependencies)
            .reduce(eachDependency, []) || [];

    function eachDependency(list, name) {
        var nested = bowerModules(path.resolve('bower_components', name, 'bower.json'));
        return list.concat(name).concat(nested);
    }
}

function config() {

    // define Webpack configuration object to be exported
    return {
        context      : __dirname,
        cache        : true,
        devtool      : 'source-map',
        entry        : {
            vendor: bowerModules('bower.json'),
            index : [
                './app/index.js',
                './app/index.scss'
            ]
        },
        output       : {
            path                                 : path.join(__dirname, 'app-build'),
            filename                             : 'assets/[name].[chunkhash].js',
            devtoolModuleFilenameTemplate        : '[absolute-resource-path]',
            devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
        },
        resolve      : {
            alias   : {
                npm: path.join(__dirname, 'node_modules')
            },
            root    : path.resolve('bower_components'),
            fallback: path.join(__dirname, 'node_modules')
        },
        resolveLoader: {
            fallback: path.join(__dirname, 'node_modules')
        },
        module       : {
            preloaders: [
                {
                    test   : /\.js$/i,
                    exclude: './node_modules',
                    loader : 'jshint'
                }
            ],
            loaders   : [

                // some obscure modules like to 'require()' angular, but bower angular does not export anything
                {
                    test   : /[\\\/]angular\.js$/i,
                    include: /[\\\/]bower_components[\\\/]/i,
                    loader : 'exports?angular'
                },

                // supported file types
                {
                    test  : /\.css$/i,
                    loader: ExtractTextPlugin.extract(
                        '',
                        'css?minimize&sourceMap!resolve-url?sourceMap'
                    )
                }, {
                    test  : /\.scss$/i,
                    loader: ExtractTextPlugin.extract(
                        '',
                        'css?minimize&sourceMap!resolve-url?sourceMap!sass?sourceMap'
                    )
                }, {
                    test   : /\.(jpe?g|png|gif|svg)([#?].*)?$/i,
                    loaders: [
                        'file?hash=sha512&digest=hex&name=/assets/[hash].[ext]',
                        'image-webpack?optimizationLevel=7&interlaced=false'
                    ]
                }, {
                    test  : /\.woff2?([#?].*)?$/i,
                    loader: 'url?limit=10000&mimetype=application/font-woff&name=/assets/[hash].[ext]'
                }, {
                    test  : /\.(eot|ttf|ico)([#?].*)?$/i,
                    loader: 'file?name=/assets/[hash].[ext]'
                }, {
                    test   : /\.js$/i,
                    include: /[\\\/]bower_components[\\\/]/i,
                    loader : 'ng-annotate?sourceMap'
                }, {
                    test   : /\.js$/i,
                    exclude: /[\\\/]bower_components[\\\/]/i,
                    loaders: [
                        'ng-annotate?sourceMap',
                        'nginject?sourceMap&deprecate',
                        'babel?stage=4&sourceMap&ignore=buffer' // https://github.com/feross/buffer/issues/79
                    ]
                }, {
                    test  : /\.html?$/i,
                    loader: 'html?removeComments=false&attrs=img:src link:href'
                }, {
                    test  : /\.json$/i,
                    loader: 'json'
                }
            ]
        },
        node         : {
            fs: 'empty'
        },
        plugins      : [
            new CleanPlugin(['app-build']),
            new OmitTildePlugin({
                include  : ['package.json', 'bower.json'],
                deprecate: true
            }),
            new BowerWebpackPlugin({
                includes                       : /\.((js|css)|(woff2?|eot|ttf)([#?].*)?)$/i,
                searchResolveModulesDirectories: false
            }),
            new webpack.ProvidePlugin({
                $              : 'jquery',
                jQuery         : 'jquery',
                'window.jQuery': 'jquery'
            }),
            new ExtractTextPlugin('assets/[name].[contenthash].css', {
                allChunks: true
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name     : 'vendor',
                minChunks: Infinity
            }),
            new HtmlPlugin({
                title   : 'Custom template',
                template: path.join(__dirname, 'app/index.html'),
                inject  : 'body'
            }),
            new webpack.optimize.DedupePlugin(),
            new ESManglePlugin(),
            new BrowserSyncPlugin({
                host  : 'localhost',
                port  : 55555,
                server: {
                    baseDir: 'app-build',
                    routes : {'/': ''}
                }
            })
        ]
    };
}

module.exports = config();