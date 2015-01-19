/* global angular:false */

var todoRoutes            = require('../todo/todoRoutes'),
    escapeKeyDirective    = require('examplelib/interaction/escapeKeyDirective'),
    focusElementDirective = require('examplelib/interaction/focusElementDirective'),
    LocalStorage          = require('../storage/LocalStorage');

angular.module('app', [ 'ui.router', 'ui.bootstrap' ])
  .config(todoRoutes)
  .directive('escape', escapeKeyDirective.forAttribute('escape'))
  .directive('focus', focusElementDirective.forAttribute('focus'))
  .value('storage', new LocalStorage('todos-angularjs'));