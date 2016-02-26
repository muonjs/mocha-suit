'use strict';

var SETUP_METHODS = ["before","beforeEach","beforeAll","after","afterEach","afterAll"];
var IT_METHODS = ["it","xit"];
var THAT_METHODS = ["that","xthat"];
var SET_METHODS = ["setBefore","setAfter","setBeforeAll","setAfterAll"];
var REPLACE_METHOD = ["replaceWith"];
var utils = require("./utils");

var _ = require("underscore");

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

module.exports = function generateDescribe(list,ctx,caseDescribe,modifiers) {
    var TargetSuit = list.shift();
    var RunningSuit = _.where(modifiers.replaceWith,{ targetSuit: TargetSuit });

    if (RunningSuit.length > 0) {
        RunningSuit = RunningSuit[0].newSuit;
    } else {
        RunningSuit = TargetSuit;
    }
    var describeString = String(TargetSuit.describe);
    describeString = utils.dotEndString(describeString);

    var run = function(){
        this.suit = ctx;
        RunningSuit.fcall && RunningSuit.fcall.call(this);

        processHandler(SET_METHODS,{
            __setBefore: _.where(modifiers.setBefore.__setBefore,{ targetSuit: TargetSuit }),
            __setBeforeAll: _.where(modifiers.setBefore.__setBeforeAll,{ targetSuit: TargetSuit })
        },ctx);

        processHandler(SETUP_METHODS,RunningSuit,ctx);

        processHandler(SET_METHODS,{
            __setAfter: _.where(modifiers.setAfter.__setAfter,{ targetSuit: TargetSuit }),
            __setAfterAll: _.where(modifiers.setAfter.__setAfterAll,{ targetSuit: TargetSuit })
        },ctx);

        if (list.length == 0){
            if (caseDescribe.length > 0){
                global[callMethod("describe")](caseDescribe,function(){
                    processHandler(IT_METHODS,RunningSuit,ctx);
                });
            } else {
                processHandler(IT_METHODS,RunningSuit,ctx);
            }
        }

        if (list.length > 0) {
            generateDescribe(list,ctx,caseDescribe,modifiers);
        } else {
            processHandler(THAT_METHODS,modifiers.that,ctx);
        }
    };

    if (TargetSuit.skip) {
        global[callMethod("xdescribe")](describeString,run);
    } else {
        global[callMethod("describe")](describeString,run);
    };
};

module.exports.SETUP_METHODS = SETUP_METHODS;
module.exports.IT_METHODS = IT_METHODS;
module.exports.THAT_METHODS = THAT_METHODS;
module.exports.SET_METHODS = SET_METHODS;
module.exports.REPLACE_METHOD = REPLACE_METHOD;