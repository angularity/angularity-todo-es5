/* global process:true */

module.exports = require('webpack-angularity-solution')({
    noApp   : process.env.ANGULARITYTODOES5_NO_APP,
    noTest  : process.env.ANGULARITYTODOES5_NO_TEST,
    noMinify: process.env.ANGULARITYTODOES5_NO_MINIFY,
    release : process.env.ANGULARITYTODOES5_RELEASE
});