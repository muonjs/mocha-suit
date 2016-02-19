'use strict';

const SETUP_METHODS = ["before","beforeEach","beforeAll","after","afterEach","afterAll"];
const IT_METHODS = ["it","xit"];
const THAT_METHODS = ["that","xthat"];
var utils = require("./utils");

var callHandler = function(f,callName,ctx){
    var fcall;
    if (f.useDone) {
        fcall = function(done) {
            this.suit = ctx;
            var args = [done];
            if (f.msg) {
                args.unshift(f.msg)
            }
            return f.fcall.apply(this,args);
        };
    } else {
        fcall = function() {
            this.suit = ctx;
            var args = [];
            if (f.msg) {
                args.unshift(f.msg)
            }
            return f.fcall.apply(this,args);
        };
    }

    var args = [fcall];
    if (f.msg) {
        args.unshift(f.msg)
    }
    global[callName].apply({},args);
};

var runHandler = function(methods,Suit,ctx){
    methods.forEach(function(callName){
        var containerName = "__"+callName;
        if (Suit[containerName] && global[callName]) {
            Suit[containerName].forEach(function(f){
                if (f.suit) {
                    runHandler([callName],f.suit,ctx);
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

        runHandler(SETUP_METHODS,Suit,ctx);

        if (caseDescribe.length > 0 && list.length == 0){
            describe(caseDescribe,function(){
                runHandler(IT_METHODS,Suit,ctx);
            });
        } else {
            runHandler(IT_METHODS,Suit,ctx);
        }

        if (list.length > 0) {
            generateDescribe(list,ctx,caseDescribe,That);
        } else {
            runHandler(IT_METHODS,That,ctx);
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

module.exports.SETUP_METHODS = SETUP_METHODS;
module.exports.IT_METHODS = IT_METHODS;
module.exports.THAT_METHODS = THAT_METHODS;