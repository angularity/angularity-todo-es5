var webpack               = require('webpack'),
    CleanPlugin           = require('clean-webpack-plugin'),
    ExtractTextPlugin     = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin     = require('html-webpack-plugin'),
    ESMangleWebpackPlugin = require('esmangle-webpack-plugin'),
    BrowserSyncPlugin     = require('browser-sync-webpack-plugin');

var slash = require('slash');

function config() {
    'use strict';

    // define Webpack configuration object to be exported
    return {
        context : __dirname,
        cache   : true,
        entry   : './app/index.js',
        devtools: 'inline-source-map',
        output  : {
            path    : __dirname + '/app-build',
            filename: 'index.js'
        },
        resolve : {
            alias: {
                npm: __dirname + '/node_modules'
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
                        'babel?stage=4&sourceMap'
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
        plugins : [
            new CleanPlugin(['app-build']),
            myResolver(['package.json', 'bower.json'], {
                deprecate: true
            }),
            new webpack.ResolverPlugin([
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
            ]),
            new ExtractTextPlugin('index.css'),
            new HtmlWebpackPlugin({
                title   : 'Custom template',
                template: __dirname + '/app/index.html',
                inject  : 'body'
            }),
            new webpack.optimize.DedupePlugin(),
            new ESMangleWebpackPlugin(),
            new BrowserSyncPlugin({
                host  : 'localhost',
                port  : 55555,
                server: {
                    baseDir: ['app-build'],
                    routes : ['', 'bower_components', 'app-build']
                        .reduce(function mapRoutes(result, path) {
                            result['/' + slash(path)] = path; // result['/<path>'] = <path>
                            return result;
                        }, {})
                }
            })
        ]
    };
}

module.exports = config();

function myResolver(json, options) {
    var path = require('path');
    return {
        apply: applyPlugin
    };

    function applyPlugin(compiler) {
        var warn     = noop,
            depNames = [].concat(json)
                .reduce(eachJSON, []);

        compiler.plugin('compilation', onCompilation);

        if (depNames.length) {
            compiler.resolvers.normal.plugin('directory', directoryResolver);
        } else {
            warn('No dependencies found, plugin will not run');
        }

        function noop() {
            /* placeholder against compilation not initialised */
        }

        function onCompilation(compilation) {
            var warnings = [];
            warn = addWarning;

            function addWarning() {
                var text = ['myResolver'].concat(Array.prototype.slice.call(arguments)) // TODO name
                        .join(' ');
                if (warnings.indexOf(text) < 0) {
                    compilation.warnings.push(text);
                    warnings.push(text);
                }
            }
        }

        function eachJSON(reduced, filename) {
            var contents;
            try {
                contents = require(path.resolve(filename));
            }
            catch (exception) {
                warn('file', filename, 'was not found in the working directory');
            }
            return reduced
                .concat(contents && Object.keys(contents.dependencies))
                .concat(contents && Object.keys(contents.devDependencies))
                .filter(Boolean)
                .reduce(flatten, []);

            function flatten(reduced, value) {
                return reduced.concat(value);
            }
        }

        function directoryResolver(candidate, done) {
            var requestText  = candidate.request,
                isCSS        = /\.s?css$/.test(path.extname(requestText)),
                split        = isCSS && requestText.split(/[\\\/]+/),
                isRelative   = split && (split[0] === '.'),
                isDependency = split && (depNames.indexOf(split[1]) >= 0);
            if (isRelative && isDependency) {
                var amended = {
                    path   : candidate.path,
                    request: requestText.slice(2),
                    query  : candidate.query,
                    module : true
                };
                this.doResolve(['module'], amended, options.deprecate ? resolved : done);
            }
            else {
                done();
            }

            function resolved(error, result) {
                if (!error && result) {
                    warn('(s)css files should use ~ to refer to modules:\n  change "' + amended.request + '" -> "~' +
                        amended.request + '"');
                }
                done(error, result);
            }
        }
    }
}