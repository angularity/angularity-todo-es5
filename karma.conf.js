/* global process:true */

module.exports = require('karma-angularity-solution')({
    port    : process.env.ANGULARITYTODOES5_PORT ? (parseInt(process.env.ANGULARITYTODOES5_PORT) + 1) : undefined,
    reporter: process.env.ANGULARITYTODOES5_KARMA_REPORTER,
    browser : process.env.ANGULARITYTODOES5_KARMA_BROWSER,
    logLevel: process.env.ANGULARITYTODOES5_KARMA_LOGLEVEL
});