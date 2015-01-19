/* global angular:false */

require('../index.js');

var MockStorage = require('../../storage/MockStorage');

angular.module('app')
  .service('storage', MockStorage);
