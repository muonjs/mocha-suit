'use strict';

var SETUP_METHODS = ["before","beforeEach","beforeAll","after","afterEach","afterAll"];
var IT_METHODS = ["it","xit"];
var THAT_METHODS = ["that","xthat"];
var utils = require("./utils");

var callMethod = function(name) {
    return global[name+"Method"];
};

var callHandler = function(f,callName,ctx){
    var fcall;
    if (f.useDone) {
        fcall = function(done) {
            this.suit = ctx;
            return f.fcall.call(this,done);
        };
    } else {
        fcall = function() {
            this.suit = ctx;
            return f.fcall.call(this);
        };
    }

    var args = [fcall];
    if (typeof f.msg === "string") {
        args.unshift(f.msg)
    }
    global[callMethod(callName)].apply({},args);
};

var processHandler = function(methods, Suit, ctx){
    methods.forEach(function(callName){
        var containerName = "__"+callName;
        if (Suit[containerName] && global[callMethod(callName)]) {
            Suit[containerName].forEach(function(f){
                if (f.suit) {
                    processHandler([callName],f.suit,ctx);
                } else {
                    callHandler(f,callName,ctx)
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

        processHandler(SETUP_METHODS,Suit,ctx);

        if (list.length == 0){
            if (caseDescribe.length > 0){
                global[callMethod("describe")](caseDescribe,function(){
                    processHandler(IT_METHODS,Suit,ctx);
                });
            } else {
                processHandler(IT_METHODS,Suit,ctx);
            }
        }

        if (list.length > 0) {
            generateDescribe(list,ctx,caseDescribe,That);
        } else {
            processHandler(THAT_METHODS,That,ctx);
        }
    };

    if (Suit.skip) {
        global[callMethod("xdescribe")](describeString,run);
    } else {
        global[callMethod("describe")](describeString,run);
    };
};

module.exports.SETUP_METHODS = SETUP_METHODS;
module.exports.IT_METHODS = IT_METHODS;
module.exports.THAT_METHODS = THAT_METHODS;