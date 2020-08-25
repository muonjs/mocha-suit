'use strict';

var fRegCheck = /^function\s*\S*?\s*\(\S+?\)/;

var SETUP_METHODS = ["before","beforeEach","beforeAll","after","afterEach","afterAll"];
var IT_METHODS = ["it","xit"];
var THAT_METHODS = ["that","xthat"];
var SET_METHODS = ["insertAbove","insertBelow"];
var REPLACE_METHOD = ["replaceWith"];
var utils = require("./utils");

var _ = require("underscore");

var method_names = require("./method_names");

var callMethod = function(name) {
    return method_names.callMethod(name);
};

var cacheContext = function(ctx,replacement) {
    replacement = replacement || {};
    var ret = {};
    for(var i in replacement) {
        ret[i] = ctx[i];
        ctx[i] = replacement[i];
    }
    return ret;
};

var restoreContext = function(ctx,cache) {
    for(var i in cache) {
        ctx[i] = cache[i];
    }
};

var callHandler = function(f,callName,ctx,ctxReplacement){
    var fcall;
    var useDone = fRegCheck.test(f.fcall.toString());
    if (useDone) {
        fcall = function(done) {
            var cache = cacheContext(ctx,ctxReplacement);
            return f.fcall.call(ctx,function() {
                restoreContext(ctx,cache);
                done.apply(null,arguments);
            });
        };
    } else {
        fcall = function() {
            var cache = cacheContext(ctx,ctxReplacement);
            var ret = f.fcall.call(ctx);
            restoreContext(ctx,cache);
            return ret;
        };
    }

    if (typeof f.msg === "string") {
        callMethod(callName)(f.msg,fcall);
    } else {
        callMethod(callName)(fcall);
    }
};

var processHandler = function(methods, Suit, ctx, args){
    methods.forEach(function(callName){
        var callList = utils.getCallList(Suit,callName);
        if (callList && callMethod(callName)) {
            callList.forEach(function(f){
                if (f.suit) {
                    var helperCallList = utils.getCallList(f.suit,callName);
                    if (helperCallList) {
                        processHandler([callName],f.suit,ctx,f.args);
                    }
                } else {
                    let suitContext = utils.getSuitContextObject(Suit,ctx);
                    Object.defineProperty(suitContext   ,"suit", {
                        value: ctx,
                        writable: false,
                        enumerable: false,
                        configurable: true
                    });
                    callHandler(f,callName,suitContext,args || {})
                }
            });
        }
    });
};

module.exports = function generateDescribe(suitHierarchy,testObj,caseDescribe,suitModifiers) {
    var TargetSuit = suitHierarchy.shift();
    var RunningSuit = _.where(suitModifiers.replaceWith,{ targetSuit: TargetSuit });

    if (RunningSuit.length > 0) {
        RunningSuit = RunningSuit[0].newSuit;
    } else {
        RunningSuit = TargetSuit;
    }

    var describeString = String(TargetSuit.describe);
    describeString = utils.dotEndString(describeString);

    var run = function(){
        RunningSuit.fcall && RunningSuit.fcall.call(this);

        _.where(suitModifiers.insertAbove,{ targetSuit: TargetSuit }).forEach(function(aboveHandlers) {
            processHandler(SETUP_METHODS,aboveHandlers.newSuit,testObj);
        });

        processHandler(SETUP_METHODS,RunningSuit,testObj);

        _.where(suitModifiers.insertBelow,{ targetSuit: TargetSuit }).forEach(function(belowHandlers) {
            processHandler(SETUP_METHODS,belowHandlers.newSuit,testObj);
        });

        processHandler(THAT_METHODS,RunningSuit,testObj);

        if (suitHierarchy.length === 0){
            if (caseDescribe !== ""){
                callMethod("describe")(caseDescribe,function(){
                    processHandler(IT_METHODS,RunningSuit,testObj);
                });
            } else {
                processHandler(IT_METHODS,RunningSuit,testObj);
            }
        }

        if (suitHierarchy.length > 0) {
            generateDescribe(suitHierarchy,testObj,caseDescribe,suitModifiers);
        }
    };

    if (TargetSuit.skip) {
        callMethod("xdescribe")(describeString,run);
    } else {
        callMethod("describe")(describeString,run);
    };
};

module.exports.SETUP_METHODS = SETUP_METHODS;
module.exports.IT_METHODS = IT_METHODS;
module.exports.THAT_METHODS = THAT_METHODS;
module.exports.SET_METHODS = SET_METHODS;
module.exports.REPLACE_METHOD = REPLACE_METHOD;
