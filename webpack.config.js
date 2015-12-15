'use strict';

var path = require('path'),
    fs   = require('fs')

var webpack             = require('webpack'),
    globSync            = require('glob-sync').globSync,
    CleanPlugin         = require('clean-webpack-plugin'),
    ExtractTextPlugin   = require('extract-text-webpack-plugin'),
    ESManglePlugin      = require('esmangle-webpack-plugin'),
    BrowserSyncPlugin   = require('browser-sync-webpack-plugin'),
    BowerWebpackPlugin  = require('bower-webpack-plugin'),
    OmitTildePlugin     = require('omit-tilde-webpack-plugin'),
    ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
    IndexHTMLPlugin     = require('indexhtml-webpack-plugin'),
    GulpInjectPlugin    = require('gulp-inject-webpack-plugin');

function bowerModules(bowerFilePath, outputPath) {
    var json = require(path.resolve(bowerFilePath)),
        list = json.dependencies && Object.keys(json.dependencies)
                .reduce(eachDependency, []) || [];

    if (outputPath) {
        if (!fs.existsSync(path.resolve(outputPath))) {
            var text = list
                .map(toRequireStatements)
                .join('\n');
            fs.writeFileSync(path.resolve(outputPath), text);
        }
    } else {
        return list;
    }

    function eachDependency(list, name) {
        var nested = bowerModules(path.resolve('bower_components', name, 'bower.json'));
        return list
            .concat(name)
            .concat(nested)
            .filter(firstOccurance);

        function firstOccurance(value, i, array) {
            return (array.indexOf(value) === i);
        }
    }

    function toRequireStatements(dep) {
        return 'require(\'' + dep + '\');';
    }
}

bowerModules('bower.json', 'app/vendor.js');

function config() {

    // define Webpack configuration object to be exported
    return {
        context      : __dirname,
        cache        : true,
        devtool      : 'source-map',
        entry        : {
            vendor: './app/vendor.js',
            index : globSync('./app/index.{js,css,scss}'),
            html  : './app/index.html'
        },
        output       : {
            path                                 : path.join(__dirname, 'app-build'),
            filename                             : 'assets/[name].[chunkhash].js',
            chunkFilename                        : 'assets/[name].[chunkhash].js',
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
                        'nginject?sourceMap&deprecate&singleQuote',
                        'babel?stage=4&sourceMap&ignore=buffer&compact=false'
                        // https://github.com/feross/buffer/issues/79
                        // http://stackoverflow.com/a/29857361/5535360
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
            // clean
            new CleanPlugin(['app-build']),

            // bower
            new OmitTildePlugin({
                include  : ['package.json', 'bower.json'],
                deprecate: true
            }),
            new BowerWebpackPlugin({
                includes                       : /\.((js|css)|(woff2?|eot|ttf)([#?].*)?)$/i,
                searchResolveModulesDirectories: false
            }),

            // deps
            new webpack.ProvidePlugin({
                $              : 'jquery',
                jQuery         : 'jquery',
                'window.jQuery': 'jquery'
            }),

            // output and chunking
            new ExtractTextPlugin(undefined, 'assets/[name].[contenthash].css', {
                allChunks: true
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name     : 'vendor',
                minChunks: Infinity
            }),
            new ESManglePlugin(),
            new ChunkManifestPlugin(),
            new IndexHTMLPlugin('html', 'index.html'),
            new GulpInjectPlugin('html', ['manifest.json', 'vendor', /^vendor\./, 'index']),

            // optimise
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),

            // server
            new BrowserSyncPlugin({
                host    : 'localhost',
                port    : 55555,
                server  : {
                    baseDir: 'app-build',
                    routes : {'/': ''}
                },
                logLevel: 'silent',
                open    : false
            })
        ]
    };
}

module.exports = config();