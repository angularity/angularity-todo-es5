(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';var todoRoutes=require("8"),escapeKeyDirective=require("3"),focusElementDirective=require("4"),LocalStorage=require("5");angular.module('app',['ui.router','ui.bootstrap']).config(todoRoutes).directive('escape',escapeKeyDirective.forAttribute('escape')).directive('focus',focusElementDirective.forAttribute('focus')).value('storage',new LocalStorage('todos-angularjs'))
},{"3":3,"4":4,"5":5,"8":8}],2:[function(require,module,exports){
'use strict';require("1");var MockStorage=require("6");angular.module('app').service('storage',MockStorage)
},{"1":1,"6":6}],3:[function(require,module,exports){
'use strict';function escapeKeyDirective(a){return{link:function b(e,f,g){var d=27;var c=g[a];if(c){f.on('keydown',function(a){if(a.keyCode===d){e.$apply(c)}})}}}}escapeKeyDirective.forAttribute=function a(b){return function(){return escapeKeyDirective(b)}};module.exports=escapeKeyDirective
},{}],4:[function(require,module,exports){
'use strict';function focusElementDirective(a,b){return{link:function c(f,d,g){var e=f.$watch(g[b],function(b){if(b){a(function(){d[0].focus()},0,false)}});d.on('$destroy',e)}}}focusElementDirective.forAttribute=function a(b){return['$timeout',function(a){return focusElementDirective(a,b)}]};module.exports=focusElementDirective
},{}],5:[function(require,module,exports){
'use strict';var MockStorage=require("6");function LocalStorage(a){this.storageID_=a}LocalStorage.prototype=new MockStorage;LocalStorage.prototype.get=function a(){var b=localStorage&&localStorage.getItem(this.storageID_);var c=b?JSON.parse(b):MockStorage.prototype.get.call(this);return c};LocalStorage.prototype.put=function a(b){if(localStorage){localStorage.setItem(this.storageID_,JSON.stringify(b))}MockStorage.prototype.put.call(this,b)};module.exports=LocalStorage
},{"6":6}],6:[function(require,module,exports){
'use strict';function MockStorage(){this.value_=undefined}MockStorage.prototype.get=function a(){return this.value_};MockStorage.prototype.put=function a(b){this.value_=b};module.exports=MockStorage
},{}],7:[function(require,module,exports){
'use strict';function TodoController(a,h,n,c){a.todos=c.get()||[];a.newTodo='';a.editedTodo=undefined;a.remainingCount=0;a.completedCount=0;a.allChecked=false;a.status=null;a.statusFilter=null;a.addTodo=f;a.editTodo=g;a.doneEditing=e;a.revertEditing=i;a.testEditing=j;a.removeTodo=k;a.clearCompletedTodos=l;a.markAll=m;a.watchTodos=d;a.onFilterChange=b;a.$watch('todos',d,true);a.$on('$stateChangeSuccess',b);function f(){var b=a.newTodo.trim();if(b.length){a.todos.push({title:b,completed:false});a.newTodo=''}}function g(b){a.editedTodo=b;a.originalTodo=angular.extend({},b)}function e(b){a.editedTodo=null;b.title=b.title.trim();if(!b.title){a.removeTodo(b)}}function i(c){var b=a.todos.indexOf(c);a.todos[b]=a.originalTodo;a.doneEditing(a.originalTodo)}function j(b){return a.editedTodo===b}function k(b){a.todos.splice(a.todos.indexOf(b),1)}function l(){a.todos=a.todos.filter(function(a){return!a.completed})}function m(b){a.todos.forEach(function(a){a.completed=!b})}function d(b,d){a.remainingCount=h('filter')(a.todos,{completed:false}).length;a.completedCount=a.todos.length-a.remainingCount;a.allChecked=!a.remainingCount;if(b!==d){c.put(a.todos)}}function b(){switch(n.params.status){case'active':a.status='active';a.statusFilter={completed:false};break;case'completed':a.status='completed';a.statusFilter={completed:true};break;default:a.status='';a.statusFilter={};break}}}TodoController.$inject=['$scope','$filter','$state','storage'];module.exports=TodoController
},{}],8:[function(require,module,exports){
'use strict';function todoRoutes(a,b){'use strict';b.otherwise('/');a.state('home',{url:'/:status',template:require("9"),controller:require("7")})}todoRoutes.$inject=['$stateProvider','$urlRouterProvider'];module.exports=todoRoutes
},{"7":7,"9":9}],9:[function(require,module,exports){
module.exports='<section id="todoapp">\n    <header id="header">\n        <h1>todos</h1>\n        <form id="todo-form" ng-submit="addTodo()">\n            <input id="new-todo" placeholder="What needs to be done?" ng-model="newTodo" autofocus>\n        </form>\n    </header>\n    <section id="main" ng-show="todos && todos.length" ng-cloak>\n        <input id="toggle-all" type="checkbox" ng-model="allChecked" ng-click="markAll(allChecked)">\n        <label for="toggle-all">Mark all as complete</label>\n        <ul id="todo-list">\n            <li ng-repeat="todo in todos | filter:statusFilter track by $index" ng-class="{completed: todo.completed, editing: todo == editedTodo}">\n                <div class="view">\n                    <input class="toggle" type="checkbox" ng-model="todo.completed">\n                    <label ng-dblclick="editTodo(todo)">{{todo.title}}</label>\n                    <button class="destroy" ng-click="removeTodo(todo)"></button>\n                </div>\n                <form ng-submit="doneEditing(todo)">\n                    <input class="edit" ng-show="testEditing(todo)" ng-trim="false" ng-model="todo.title" escape="revertEditing(todo)" ng-blur="doneEditing(todo)" focus="testEditing(todo)">\n                </form>\n            </li>\n        </ul>\n    </section>\n    <footer id="footer" ng-show="todos && todos.length" ng-cloak>\n        <span id="todo-count"><strong>{{remainingCount}}</strong>\n            <ng-pluralize count="remainingCount" when="{ one: \'item left\', other: \'items left\' }"></ng-pluralize>\n        </span>\n        <ul id="filters">\n            <li>\n                <a ng-class="{selected: status == \'\'}" href="#/">All</a>\n            </li>\n            <li>\n                <a ng-class="{selected: status == \'active\'}" href="#/active">Active</a>\n            </li>\n            <li>\n                <a ng-class="{selected: status == \'completed\'}" href="#/completed">Completed</a>\n            </li>\n        </ul>\n        <button id="clear-completed" ng-click="clearCompletedTodos()" ng-show="completedCount">Clear completed ({{completedCount}})</button>\n    </footer>\n</section>\n'
},{}]},{},[2])
//# sourceMappingURL=index.js.map
