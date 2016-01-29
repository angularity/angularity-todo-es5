/* global process:true */

module.exports = require('webpack-angularity-solution')({
    port    : process.env.ANGULARITYTODOES5_PORT ? parseInt(process.env.ANGULARITYTODOES5_PORT) : undefined,
    noApp   : process.env.ANGULARITYTODOES5_NO_APP,
    noTest  : process.env.ANGULARITYTODOES5_NO_TEST,
    noMinify: process.env.ANGULARITYTODOES5_NO_MINIFY,
    release : process.env.ANGULARITYTODOES5_RELEASE
});