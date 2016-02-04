/* global process:true */

module.exports = require('karma-angularity-solution')({
    port    : process.env.PORT ? (parseInt(process.env.PORT) + 1) : undefined,
    reporter: process.env.KARMA_REPORTER,
    browser : process.env.KARMA_BROWSER,
    logLevel: process.env.KARMA_LOGLEVEL
});