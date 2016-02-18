'use strict';

const METHODS = ["before","beforeEach","beforeAll","after","afterEach","afterAll"];
const IT_METHODS = ["it","xit"];
const THAT_METHODS = ["that","xthat"];
var utils = require("./utils");

var runSetup = function(Suit,ctx){
    METHODS.forEach(function(callName){
        var containerName = "__"+callName;
        if (Suit[containerName] && global[callName]) {
            Suit[containerName].forEach(function(f){
                if (f.useDone) {
                    global[callName](function(done) {
                        this.suit = ctx;
                        return f.fcall.call(this,done);
                    });
                } else {
                    global[callName](function() {
                        this.suit = ctx;
                        return f.fcall.call(this);
                    });
                }
            });
        }
    });
};

var runIt = function(Suit,ctx){
    IT_METHODS.forEach(function(callName){
        var containerName = "__"+callName;
        if (Suit[containerName] && global[callName]) {
            Suit[containerName].forEach(function(f){
                if (f.useDone) {
                    global[callName](f.msg,function(done) {
                        this.suit = ctx;
                        return f.fcall.call(this,done);
                    });
                } else {
                    global[callName](f.msg,function() {
                        this.suit = ctx;
                        return f.fcall.call(this);
                    });
                }
            });
        }
    });
};

module.exports = function generateDescribe(list,ctx,caseDescribe,That) {
    var Suit = list.shift();
    var describeString = String(Suit.describe);
    describeString = utils.dotEndString(describeString);

    var run = function(){
        this.suit = ctx;
        Suit.fcall && Suit.fcall.call(this);

        runSetup(Suit,ctx);

        if (caseDescribe.length > 0 && list.length == 0){
            describe(caseDescribe,function(){
                runIt(Suit,ctx);
            });
        } else {
            runIt(Suit,ctx);
        }

        if (list.length > 0) {
            generateDescribe(list,ctx,caseDescribe,That);
        } else {
            runIt(That,ctx);
        }
    };

    if (describeString.length > 0) {
        if (Suit.skip) {
            xdescribe(describeString,run);
        } else {
            describe(describeString,run);
        }
    } else {
        run.call({});
    };
};

module.exports.METHODS = METHODS;
module.exports.IT_METHODS = IT_METHODS;
module.exports.THAT_METHODS = THAT_METHODS;