'use strict';

global.should = require("should");
global.expect = require("expect.js");
global.sinon = require("sinon");

var _ = require("underscore");

var generateMochaMethod = require("./spy");

var mochaMethods = [
    "describe",
    "xdescribe",
    "before",
    "beforeEach",
    "it",
    "xit",
    "after",
    "afterEach"
];

var substitutedMethods = {};

_.defaults(global,{
    describeMethod: "test_describe",
    xdescribeMethod: "test_xdescribe",
    beforeMethod: "test_before",
    beforeEachMethod: "test_beforeEach",
    afterMethod: "test_after",
    afterEachMethod: "test_afterEach",
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
}

mochaMethods.forEach(function(method){
    substitutedMethods[method] = global["test_"+method] = generateMochaMethod();
});

global.ResetSpyMethods = function(){
    mochaMethods.forEach(function(method){
        substitutedMethods[method].reset();
    });
};

global.ResetSpyMethods = function(){
    mochaMethods.forEach(function(method){
        substitutedMethods[method].reset();
    });
};

global.RunSpyMethods = function(){
    mochaMethods.forEach(function(method){
        substitutedMethods[method].run();
    });
};

global.capitalize = function(str) {
    var temp = str.split("");
    var firstLetter = temp.shift();
    temp.unshift(firstLetter.toUpperCase());
    return temp.join("");
};