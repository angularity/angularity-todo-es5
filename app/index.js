var todoRoutes            = require('../todo/todo-routes'),
    escapeKeyDirective    = require('examplelib/interaction/escape-key-directive'),
    focusElementDirective = require('examplelib/interaction/focus-element-directive'),
    LocalStorage          = require('../storage/local-storage');

import 'jquery';
import 'angular';
import 'angular-bootstrap';
import 'angular-ui-router';

import '../style/bootstrap-stuff.scss';
import '../style/white-on-blue.scss';
import '../style/todo.scss';
import '../style/images.scss';

angular.module('app', [ 'ui.router', 'ui.bootstrap' ])
  .config(todoRoutes)
  .directive('escape', escapeKeyDirective.forAttribute('escape'))
  .directive('focus', focusElementDirective.forAttribute('focus'))
  .value('storage', new LocalStorage('todos-angularjs'));