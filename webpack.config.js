/* global process:true */

var angularity = require('webpack-angularity-solution');

const GLOBALS = {
    $              : 'jquery',
    jQuery         : 'jquery',
    'window.jQuery': 'jquery'
};

module.exports = angularity({globals: GLOBALS}, process.env)
    .define('common')
        .plugin('notifier', require('webpack-notifier'), [{title: 'Webpack'}])
    .include(process.env.MODE)
    .otherwise('app,test')
    .resolve();