/* globals localStorage */

var MockStorage = require('./mock-storage');

/**
 * <p>Store a single value in HTML5 local storage.</p>
 */
function LocalStorage(storageID) {

  // private variables
  this.storageID_ = storageID;
}

LocalStorage.prototype = new MockStorage();

/**
 * <p>Retrieve a value.</p>
 * @returns {*} The value in local storage, where defined
 */
LocalStorage.prototype.get = function get() {
  var json  = localStorage && localStorage.getItem(this.storageID_);
  var value = (json) ? JSON.parse(json) : MockStorage.prototype.get.call(this);
  return value;
};

/**
 * <p>Set a value.</p>
 * @param {*} value The value to storage in local storage
 */
LocalStorage.prototype.put = function put(value) {
  if (localStorage) {
    localStorage.setItem(this.storageID_, JSON.stringify(value));
  }
  MockStorage.prototype.put.call(this, value);
};

module.exports = LocalStorage;