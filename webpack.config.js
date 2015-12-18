/* global process:true */

module.exports = require('webpack-angularity-solution')({
    port    : 55555,
    noApp   : process.env.ANGULARITYTODOES5_NO_APP,
    noTest  : process.env.ANGULARITYTODOES5_NO_TEST,
    noMinify: process.env.ANGULARITYTODOES5_NO_MINIFY
});