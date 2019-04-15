'use strict';

var fRegCheck = /^function\s*\S*?\s*\(\S+?\)/;

var SETUP_METHODS = ["before","beforeEach","beforeAll","after","afterEach","afterAll"];
var IT_METHODS = ["it","xit"];
var THAT_METHODS = ["that","xthat"];
var SET_METHODS = ["setBefore","setAfter","setBeforeAll","setAfterAll"];
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
            this.suit = ctx;
            return f.fcall.call(this,function() {
                restoreContext(ctx,cache);
                done.apply(null,arguments);
            });
        };
    } else {
        fcall = function() {
            var cache = cacheContext(ctx,ctxReplacement);
            this.suit = ctx;
            var ret = f.fcall.call(this);
            restoreContext(ctx,cache);
            return ret;
        };
    }

    var args = [fcall];
    if (typeof f.msg === "string") {
        args.unshift(f.msg)
    }
    callMethod(callName).apply({},args);
};

var processHandler = function(methods, Suit, ctx, args){
    methods.forEach(function(callName){
        var containerName = "__"+callName;
        if (Suit[containerName] && callMethod(callName)) {
            Suit[containerName].forEach(function(f){
                if (f.suit) {
                    processHandler([callName],f.suit,ctx,f.args);
                } else {
                    callHandler(f,callName,ctx,args || {})
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

        if (list.length === 0){
            if (caseDescribe !== ""){
                callMethod("describe")(caseDescribe,function(){
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