/* global process:true */

module.exports = require('webpack-angularity-solution')({
    globals: {
        $              : 'jquery',
        jQuery         : 'jquery',
        'window.jQuery': 'jquery'
    }
}).resolve(function () {
    /* jshint validthis:true */
    return (process.env.MODE in this) ? this[process.env.MODE] : [].concat(this.app).concat(this.test);
});