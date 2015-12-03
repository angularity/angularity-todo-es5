/* globals describe, beforeEach, afterEach, it, expect, jasmine, localStorage */

var LocalStorage = require('./local-storage');

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
        ['null', null],
        ['text', 'a'],
        ['zero', 0],
        ['int', 10],
        ['float', 12.2],
        ['array', ['a', 0, {}]],
        ['object', {'a': 'a', 'b': 0, 'c': {}}]
    ];

    // create a description for each value
    function describeTest(title, value, index) {
        describe('.. and for ' + title, function () {
            if (index === 0) {
                it('should be initially undefined', function () {
                    expect(this.instance.get()).toBeUndefined();
                });
            }
            it('should be set without a return value', function () {
                expect(this.instance.put(value)).toBeUndefined();
            });
            it('should have the value when required', function () {
                this.instance.put(value);
                expect(this.instance.get()).toEqual(value);
            });
        });
    }

    // create a description for each key
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

    // attempt 3 random keys
    for (var i = 0; i < 3; i++) {
        describeForKey(randomString());
    }

});
