/* global angular:false */

var todoRoutes            = require('../todo/todo-routes'),
    escapeKeyDirective    = require('examplelib/interaction/escape-key-directive'),
    focusElementDirective = require('examplelib/interaction/focus-element-directive'),
    LocalStorage          = require('../storage/local-storage');

angular.module('app', [ 'ui.router', 'ui.bootstrap' ])
  .config(todoRoutes)
  .directive('escape', escapeKeyDirective.forAttribute('escape'))
  .directive('focus', focusElementDirective.forAttribute('focus'))
  .value('storage', new LocalStorage('todos-angularjs'));