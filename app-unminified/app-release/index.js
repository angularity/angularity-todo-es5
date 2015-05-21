(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var todoRoutes = require("../todo/todo-routes"), escapeKeyDirective = require("examplelib/interaction/escape-key-directive"), focusElementDirective = require("examplelib/interaction/focus-element-directive"), LocalStorage = require("../storage/local-storage");
angular.module('app', [
    'ui.router',
    'ui.bootstrap'
]).config(todoRoutes).directive('escape', escapeKeyDirective.forAttribute('escape')).directive('focus', focusElementDirective.forAttribute('focus')).value('storage', new LocalStorage('todos-angularjs'));
},{"../storage/local-storage":4,"../todo/todo-routes":7,"examplelib/interaction/escape-key-directive":2,"examplelib/interaction/focus-element-directive":3}],2:[function(require,module,exports){
'use strict';
function escapeKeyDirective(attribute) {
    return {
        link: function link(scope, element, attributes) {
            var ESCAPE_KEY = 27;
            var action = attributes[attribute];
            if (action) {
                element.on('keydown', function (event) {
                    if (event.keyCode === ESCAPE_KEY) {
                        scope.$apply(action);
                    }
                });
            }
        }
    };
}
escapeKeyDirective.forAttribute = function forAttribute(attribute) {
    return function () {
        return escapeKeyDirective(attribute);
    };
};
module.exports = escapeKeyDirective;
},{}],3:[function(require,module,exports){
'use strict';
function focusElementDirective($timeout, attribute) {
    return {
        link: function link(scope, element, attributes) {
            var unwatch = scope.$watch(attributes[attribute], function (value) {
                if (value) {
                    $timeout(function () {
                        element[0].focus();
                    }, 0, false);
                }
            });
            element.on('$destroy', unwatch);
        }
    };
}
focusElementDirective.forAttribute = function forAttribute(attribute) {
    return [
        '$timeout',
        function ($timeout) {
            return focusElementDirective($timeout, attribute);
        }
    ];
};
module.exports = focusElementDirective;
},{}],4:[function(require,module,exports){
'use strict';
var MockStorage = require("./mock-storage");
function LocalStorage(storageID) {
    this.storageID_ = storageID;
}
LocalStorage.prototype = new MockStorage();
LocalStorage.prototype.get = function get() {
    var json = localStorage && localStorage.getItem(this.storageID_);
    var value = json ? JSON.parse(json) : MockStorage.prototype.get.call(this);
    return value;
};
LocalStorage.prototype.put = function put(value) {
    if (localStorage) {
        localStorage.setItem(this.storageID_, JSON.stringify(value));
    }
    MockStorage.prototype.put.call(this, value);
};
module.exports = LocalStorage;
},{"./mock-storage":5}],5:[function(require,module,exports){
'use strict';
function MockStorage() {
    this.value_ = undefined;
}
MockStorage.prototype.get = function get() {
    return this.value_;
};
MockStorage.prototype.put = function put(value) {
    this.value_ = value;
};
module.exports = MockStorage;
},{}],6:[function(require,module,exports){
'use strict';
function TodoController($scope, $filter, $state, storage) {
    $scope.todos = storage.get() || [];
    $scope.newTodo = '';
    $scope.editedTodo = undefined;
    $scope.remainingCount = 0;
    $scope.completedCount = 0;
    $scope.allChecked = false;
    $scope.status = null;
    $scope.statusFilter = null;
    $scope.addTodo = addTodo;
    $scope.editTodo = editTodo;
    $scope.doneEditing = doneEditing;
    $scope.revertEditing = revertEditing;
    $scope.testEditing = testEditing;
    $scope.removeTodo = removeTodo;
    $scope.clearCompletedTodos = clearCompletedTodos;
    $scope.markAll = markAll;
    $scope.watchTodos = watchTodos;
    $scope.onFilterChange = onFilterChange;
    $scope.$watch('todos', watchTodos, true);
    $scope.$on('$stateChangeSuccess', onFilterChange);
    function addTodo() {
        var text = $scope.newTodo.trim();
        if (text.length) {
            $scope.todos.push({
                title: text,
                completed: false
            });
            $scope.newTodo = '';
        }
    }
    function editTodo(value) {
        $scope.editedTodo = value;
        $scope.originalTodo = angular.extend({}, value);
    }
    function doneEditing(value) {
        $scope.editedTodo = null;
        value.title = value.title.trim();
        if (!value.title) {
            $scope.removeTodo(value);
        }
    }
    function revertEditing(value) {
        var index = $scope.todos.indexOf(value);
        $scope.todos[index] = $scope.originalTodo;
        $scope.doneEditing($scope.originalTodo);
    }
    function testEditing(value) {
        return $scope.editedTodo === value;
    }
    function removeTodo(value) {
        $scope.todos.splice($scope.todos.indexOf(value), 1);
    }
    function clearCompletedTodos() {
        $scope.todos = $scope.todos.filter(function (val) {
            return !val.completed;
        });
    }
    function markAll(completed) {
        $scope.todos.forEach(function (todo) {
            todo.completed = !completed;
        });
    }
    function watchTodos(newValue, oldValue) {
        $scope.remainingCount = $filter('filter')($scope.todos, { completed: false }).length;
        $scope.completedCount = $scope.todos.length - $scope.remainingCount;
        $scope.allChecked = !$scope.remainingCount;
        if (newValue !== oldValue) {
            storage.put($scope.todos);
        }
    }
    function onFilterChange() {
        switch ($state.params.status) {
        case 'active':
            $scope.status = 'active';
            $scope.statusFilter = { completed: false };
            break;
        case 'completed':
            $scope.status = 'completed';
            $scope.statusFilter = { completed: true };
            break;
        default:
            $scope.status = '';
            $scope.statusFilter = {};
            break;
        }
    }
}
TodoController.$inject = [
    '$scope',
    '$filter',
    '$state',
    'storage'
];
module.exports = TodoController;
},{}],7:[function(require,module,exports){
'use strict';
function todoRoutes($stateProvider, $urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('home', {
        url: '/:status',
        template: require("./view/todo.html"),
        controller: require("./controller/todo-controller")
    });
}
todoRoutes.$inject = [
    '$stateProvider',
    '$urlRouterProvider'
];
module.exports = todoRoutes;
},{"./controller/todo-controller":6,"./view/todo.html":8}],8:[function(require,module,exports){
module.exports = '<section id="todoapp">\n    <header id="header">\n        <h1>todos</h1>\n        <form id="todo-form" ng-submit="addTodo()">\n            <input id="new-todo" placeholder="What needs to be done?" ng-model="newTodo" autofocus>\n        </form>\n    </header>\n    <section id="main" ng-show="todos && todos.length" ng-cloak>\n        <input id="toggle-all" type="checkbox" ng-model="allChecked" ng-click="markAll(allChecked)">\n        <label for="toggle-all">Mark all as complete</label>\n        <ul id="todo-list">\n            <li ng-repeat="todo in todos | filter:statusFilter track by $index" ng-class="{completed: todo.completed, editing: todo == editedTodo}">\n                <div class="view">\n                    <input class="toggle" type="checkbox" ng-model="todo.completed">\n                    <label ng-dblclick="editTodo(todo)">{{todo.title}}</label>\n                    <button class="destroy" ng-click="removeTodo(todo)"></button>\n                </div>\n                <form ng-submit="doneEditing(todo)">\n                    <input class="edit" ng-show="testEditing(todo)" ng-trim="false" ng-model="todo.title" escape="revertEditing(todo)" ng-blur="doneEditing(todo)" focus="testEditing(todo)">\n                </form>\n            </li>\n        </ul>\n    </section>\n    <footer id="footer" ng-show="todos && todos.length" ng-cloak>\n        <span id="todo-count"><strong>{{remainingCount}}</strong>\n            <ng-pluralize count="remainingCount" when="{ one: \'item left\', other: \'items left\' }"></ng-pluralize>\n        </span>\n        <ul id="filters">\n            <li>\n                <a ng-class="{selected: status == \'\'}" href="#/">All</a>\n            </li>\n            <li>\n                <a ng-class="{selected: status == \'active\'}" href="#/active">Active</a>\n            </li>\n            <li>\n                <a ng-class="{selected: status == \'completed\'}" href="#/completed">Completed</a>\n            </li>\n        </ul>\n        <button id="clear-completed" ng-click="clearCompletedTodos()" ng-show="completedCount">Clear completed ({{completedCount}})</button>\n    </footer>\n</section>\n';
},{}]},{},[1])
//# sourceMappingURL=index.js.map
