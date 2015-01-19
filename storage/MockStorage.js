function MockStorage() {

  // private variables
  this.value_ = undefined;
}

MockStorage.prototype.get = function get() {
  return this.value_;
};

MockStorage.prototype.put = function put(value) {
  this.value_ = value;
};

module.exports = MockStorage;