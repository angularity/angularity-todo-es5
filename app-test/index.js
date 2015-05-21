(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var escapeKeyDirective = require("examplelib/interaction/escape-key-directive");
describe('escape-key-directive', function () {
    var scope;
    var element;
    angular.module('escape-key-directive', []).directive('escape', escapeKeyDirective.forAttribute('escape'));
    beforeEach(angular.mock.module('escape-key-directive'));
    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
        scope.handler = function () {
        };
        spyOn(scope, 'handler');
    }));
    beforeEach(inject(function ($compile) {
        var form = $compile('<form id="form"><input escape="handler()"/></form>')(scope);
        element = form.find('input');
    }));
    it('should have the given scope', function () {
        expect(element.scope()).toBe(scope);
    });
    it('should hook ESC keydown on the element', function () {
        element.trigger({
            type: 'keydown',
            keyCode: 27,
            witch: String.fromCharCode(27)
        });
        expect(scope.handler).toHaveBeenCalled();
    });
});
},{"examplelib/interaction/escape-key-directive":3}],2:[function(require,module,exports){
'use strict';
var focusElementDirective = require("examplelib/interaction/focus-element-directive");
describe('focus-element-directive', function () {
    var scope;
    var element;
    var timeout;
    angular.module('focus-element-directive', []).directive('focus', focusElementDirective.forAttribute('focus'));
    beforeEach(angular.mock.module('focus-element-directive'));
    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
        scope.value = false;
    }));
    beforeEach(inject(function ($compile, $timeout) {
        var form = $compile('<form id="form"><input focus="value"/></form>')(scope);
        element = form.find('input');
        timeout = $timeout;
        form.appendTo(document.body);
    }));
    afterEach(function () {
        element.remove();
        timeout = null;
        scope = null;
        element = null;
    });
    it('should have the given scope', function () {
        expect(element.scope()).toBe(scope);
    });
    it('should receive focus following assertion of the attributed value', function () {
        scope.value = true;
        scope.$digest();
        timeout.flush();
        expect(document.activeElement.tagName).toBe('INPUT');
    });
});
},{"examplelib/interaction/focus-element-directive":4}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./mock-storage":7}],6:[function(require,module,exports){
'use strict';
var LocalStorage = require("./local-storage");
var randomStrings = [];
function randomString() {
    'use strict';
    function randomChar() {
        return String.fromCharCode(32 + Math.floor(Math.random() * 95));
    }
    function randomChars(length) {
        var result = '';
        for (var i = length; i > 0; i--) {
            result += randomChar();
        }
        return result;
    }
    var result;
    do {
        result = randomChars(1 + Math.floor(Math.random() * 10));
    } while (randomStrings.indexOf(result) >= 0);
    randomStrings.push(result);
    return result;
}
describe('local-storage', function () {
    'use strict';
    var TESTS = [
        [
            'null',
            randomString(),
            null
        ],
        [
            'text',
            randomString(),
            'a'
        ],
        [
            'zero',
            randomString(),
            0
        ],
        [
            'int',
            randomString(),
            10
        ],
        [
            'float',
            randomString(),
            12.2
        ],
        [
            'array',
            randomString(),
            [
                'a',
                0,
                {}
            ]
        ],
        [
            'object',
            randomString(),
            {
                a: 'a',
                b: 0,
                c: {}
            }
        ]
    ];
    function describeTest(title, key, value, index) {
        describe('.. and for ' + title, function () {
            if (index === 0) {
                it('should be initially undefined', function () {
                    expect(this.instance.get(key)).toBeUndefined();
                });
            }
            it('should be set without a return value', function () {
                expect(this.instance.put(key, value)).toBeUndefined();
            });
            it('should have the value when required', function () {
                expect(this.instance.put(key)).toBeUndefined(value);
            });
        });
    }
    function describeForKey(storageKey) {
        describe('for key "' + storageKey + '"', function () {
            beforeEach(function () {
                this.instance = new LocalStorage(storageKey);
            });
            it('should be an instance', function () {
                expect(this.instance).toEqual(jasmine.any(LocalStorage));
            });
            TESTS.forEach(function (args, i) {
                describeTest.apply(this, args.concat(i));
            });
            afterEach(function () {
                localStorage.clear();
            });
        });
    }
    for (var i = 0; i < 3; i++) {
        describeForKey(randomString());
    }
});
},{"./local-storage":5}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
'use strict';
var TodoController = require("./todo-controller"), MockStorage = require("../../storage/mock-storage");
describe('todo-controller', function () {
    'use strict';
    var scope;
    var storage;
    var state;
    angular.module('todo-controller', []).controller('TodoController', TodoController);
    beforeEach(function () {
        jasmine.addMatchers({
            toHaveProperty: function toHaveProperty() {
                return {
                    compare: function compare(actual, expected) {
                        var pass = typeof actual === 'object' && typeof expected === 'string' && expected in actual;
                        return {
                            pass: pass,
                            message: 'given object ' + (pass ? 'contains' : 'does not contain') + ' property ' + expected
                        };
                    }
                };
            },
            toHaveMethod: function toHaveMethod() {
                return {
                    compare: function compare(actual, expected) {
                        var pass = typeof actual === 'object' && typeof expected === 'string' && expected in actual && typeof actual[expected] === 'function';
                        return {
                            pass: pass,
                            message: 'given object ' + (pass ? 'contains' : 'does not contain') + ' method ' + expected
                        };
                    }
                };
            }
        });
    });
    beforeEach(angular.mock.module('todo-controller'));
    beforeEach(function () {
        storage = new MockStorage();
    });
    beforeEach(function () {
        state = { params: {} };
    });
    beforeEach(inject(function ($rootScope, $controller, $filter) {
        scope = $rootScope.$new();
        $controller('TodoController', {
            $scope: scope,
            $filter: $filter,
            $state: state,
            storage: storage
        });
    }));
    describe('at initialisation', function () {
        it('should contain an empty todos list', function () {
            expect(scope).toHaveProperty('todos');
            expect(scope.todos).toEqual([]);
        });
        it('should have an empty string new todo', function () {
            expect(scope).toHaveProperty('newTodo');
            expect(scope.newTodo).toEqual('');
        });
        it('should have an undefined edited todo', function () {
            expect(scope).toHaveProperty('editedTodo');
            expect(scope.editedTodo).not.toBeDefined();
        });
        it('should have method addTodo()', function () {
            expect(scope).toHaveMethod('addTodo');
        });
        it('should have method editTodo()', function () {
            expect(scope).toHaveMethod('editTodo');
        });
        it('should have method doneEditing()', function () {
            expect(scope).toHaveMethod('doneEditing');
        });
        it('should have method revertEditing()', function () {
            expect(scope).toHaveMethod('revertEditing');
        });
        it('should have method testEditing()', function () {
            expect(scope).toHaveMethod('testEditing');
        });
        it('should have method removeTodo()', function () {
            expect(scope).toHaveMethod('removeTodo');
        });
        it('should have method clearCompletedTodos()', function () {
            expect(scope).toHaveMethod('clearCompletedTodos');
        });
        it('should have method markAll()', function () {
            expect(scope).toHaveMethod('markAll');
        });
    });
});
},{"../../storage/mock-storage":7,"./todo-controller":8}]},{},[1,2,6,9])
//# sourceMappingURL=index.js.map
