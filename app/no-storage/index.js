
require('../index.js');

var MockStorage = require('../../storage/mock-storage');

angular.module('app')
  .service('storage', MockStorage);