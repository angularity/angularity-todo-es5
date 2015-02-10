/**
 * <p>Routing for the to-do app.</p>
 * @ngInject
 * @param {object} $StateProvider
 * @param {object} $urlRouterProvider
 */
function todoRoutes($stateProvider, $urlRouterProvider) {
  'use strict';
  $urlRouterProvider.otherwise('/')
  $stateProvider
    .state('home', {
      url:        '/:status',
      template:   require('./view/todo.html'),
      controller: require('./controller/todo-controller')
    });
}
module.exports = todoRoutes;