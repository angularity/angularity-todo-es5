var MockStorage = require('../../storage/mock-storage');

import '../index.js';

angular.module('app')
  .service('storage', MockStorage);
