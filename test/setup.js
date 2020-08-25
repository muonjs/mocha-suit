'use strict';

require("should");
global.should.config.checkProtoEql = false;
global.expect = require("expect.js");
global.sinon = require("sinon");

var method_names = require("../lib/method_names");

var _ = require("underscore");

var generateMochaMethod = require("./spy");

var testMethods = [
    "describe",
    "xdescribe",
    "before",
    "beforeAll",
    "beforeEach",
    "it",
    "xit",
    "after",
    "afterEach",
    "afterAll"
];

var substitutedMethods = {};

method_names.renameMethod({
    describeMethod: "test_describe",
    xdescribeMethod: "test_xdescribe",
    beforeMethod: "test_before",
    beforeAllMethod: "test_beforeAll",
    beforeEachMethod: "test_beforeEach",
    afterMethod: "test_after",
    afterEachMethod: "test_afterEach",
    afterAllMethod: "test_afterAll",
    itMethod: "test_it",
    xitMethod: "test_xit"
});

global.NormalizeTests = function(){
    if (!global.hasOwnProperty("before") && !global.hasOwnProperty("beforeAll")) {
        throw Error("There is no proper setup methods. Probably unknown Test framework. Exiting.")
    }

    if (!global.hasOwnProperty("before") && global.hasOwnProperty("beforeAll")) {
        global.before = global.beforeAll;
        global.after = global.afterAll;
    }
};

testMethods.forEach(function(method){
    substitutedMethods[method] = global["test_"+method] = generateMochaMethod("test_"+method);
});

global.ResetSpyMethods = function(){
    testMethods.forEach(function(method){
        substitutedMethods[method].reset();
    });
};

global.RunSpyMethods = function(){
    testMethods.forEach(function(method){
        substitutedMethods[method].run();
    });
};

global.capitalize = function(str) {
    var temp = str.split("");
    var firstLetter = temp.shift();
    temp.unshift(firstLetter.toUpperCase());
    return temp.join("");
};
