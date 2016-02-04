/* global process:true */

module.exports = require('webpack-angularity-solution')({
    port    : process.env.PORT ? parseInt(process.env.PORT) : undefined,
    noApp   : process.env.NO_APP,
    noTest  : process.env.NO_TEST,
    noMinify: process.env.NO_MINIFY,
    release : process.env.RELEASE,
    provide : {
        $              : 'jquery',
        jQuery         : 'jquery',
        'window.jQuery': 'jquery'
    }
});