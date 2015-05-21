/**
 * <p>Controller for the to-do application.</p>
 * @ngInject
 */
function TodoController($scope, $filter, $state, storage) {

  // initialise scope
  $scope.todos               = storage.get() || [];
  $scope.newTodo             = '';
  $scope.editedTodo          = undefined;
  $scope.remainingCount      = 0;
  $scope.completedCount      = 0;
  $scope.allChecked          = false;
  $scope.status              = null;
  $scope.statusFilter        = null;
  $scope.addTodo             = addTodo;
  $scope.editTodo            = editTodo;
  $scope.doneEditing         = doneEditing;
  $scope.revertEditing       = revertEditing;
  $scope.testEditing         = testEditing;
  $scope.removeTodo          = removeTodo;
  $scope.clearCompletedTodos = clearCompletedTodos;
  $scope.markAll             = markAll;
  $scope.watchTodos          = watchTodos;
  $scope.onFilterChange      = onFilterChange;

  // synchronise model with storage
  $scope.$watch('todos', watchTodos, true);

  // observe the current state for changes and adjust the filter
  $scope.$on('$stateChangeSuccess', onFilterChange);

  /**
   * <p>Commit the to-do object currently assigned to <code>newTodo</code>.</p>
   */
  function addTodo() {
    var text = $scope.newTodo.trim();
    if (text.length) {
      $scope.todos.push({
        title: text, completed: false
      });
      $scope.newTodo = '';
    }
  }

  /**
   * <p>Mark the given to-do object as being edited.</p>
   * <p>This will make it the <code>editedTodo</code> that may be reinstated on cancellation of editing.</p>
   * @param {object} value The to-do object that is being edited
   */
  function editTodo(value) {
    $scope.editedTodo = value;
    $scope.originalTodo = angular.extend({}, value); // Clone the original to restore it on demand.
  }

  /**
   * <p>Commit the to-do currently being edited.</p>
   * <p>If the <code>title</code> is empty the value will be removed.</p>
   * @param {object} value The to-do object that is being edited
   */
  function doneEditing(value) {
    $scope.editedTodo = null;
    value.title = value.title.trim();
    if (!value.title) {
      $scope.removeTodo(value);
    }
  }

  /**
   * <p>Cancel editing the given to-do and reinstate the pre-edit state.</p>
   * @param {object} value The to-do object that is being edited
   */
  function revertEditing(value) {
    var index = $scope.todos.indexOf(value);
    $scope.todos[index] = $scope.originalTodo;
    $scope.doneEditing($scope.originalTodo);
  }

  /**
   * <p>Test whether the given to-do value is being edited.</p>
   * @param {object} value The to-do object to query
   * @returns {boolean} True where the given to-do is being edited
   */
  function testEditing(value) {
    return ($scope.editedTodo === value);
  }

  /**
   * <p>Remove the given to-do value from the collection.</p>
   * @param {object} value The to-do object to remove
   */
  function removeTodo(value) {
    $scope.todos.splice($scope.todos.indexOf(value), 1);
  }

  /**
   * <p>Remove all to-do values that are marked as completed.</p>
   */
  function clearCompletedTodos() {
    $scope.todos = $scope.todos.filter(function (val) {
      return !val.completed;
    });
  }

  /**
   * <p>Mark all to-do values with the given completion value.</p>
   * @param {boolean} completed The completed status to assign to all to-do values
   */
  function markAll(completed) {
    $scope.todos.forEach(function (todo) {
      todo.completed = !completed;
    });
  }

  /**
   * <p>Watch handler that commits the to-do list to storage when it changes.</p>
   * @param {Array.<object>} newValue The new value of the list
   * @param {Array.<object>} oldValue The previous value of the list
   */
  function watchTodos(newValue, oldValue) {
    $scope.remainingCount = $filter('filter')($scope.todos, {completed: false}).length;
    $scope.completedCount = $scope.todos.length - $scope.remainingCount;
    $scope.allChecked     = !$scope.remainingCount;
    if (newValue !== oldValue) {
      storage.put($scope.todos);
    }
  }

  /**
   * <p>State change handler that implements a filter based on state parameters.</p>
   */
  function onFilterChange() {
    switch ($state.params.status) {
      case 'active':
        $scope.status = 'active';
        $scope.statusFilter = {completed: false};
        break;
      case 'completed':
        $scope.status = 'completed';
        $scope.statusFilter = {completed: true};
        break;
      default:
        $scope.status = '';
        $scope.statusFilter = {};
        break;
    }
  }
}

module.exports = TodoController;