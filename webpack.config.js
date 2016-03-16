/* global process:true */

var angularity = require('webpack-angularity-solution');

const GLOBALS = {
    $              : 'jquery',
    jQuery         : 'jquery',
    'window.jQuery': 'jquery'
};

module.exports = angularity(process.env, {globals: GLOBALS})
    .define('common')
        .append(addPlugin)
    .include(process.env.MODE)
    .otherwise('app,test')
    .resolve();

function addPlugin(configurator, options) {
  return configurator
    .plugin('notifier', require('webpack-notifier'), [{title: 'Webpack'}]);
}