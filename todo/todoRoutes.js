var template       = require('./partial/todo.html'),
    TodoController = require('./controller/TodoController');

/**
 * <p>Routing for the to-do app.</p>
 * @ngInject
 * @param {object} $StateProvider
 * @param {object} $urlRouterProvider
 */
function todoRoutes($stateProvider, $urlRouterProvider) {
  'use strict';
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url:        '/:status',
      template:   template,
      controller: TodoController
    });
}
module.exports = todoRoutes;