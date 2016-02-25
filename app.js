'use strict';

var fRegCheck = /^function\s+\(\S+?\)/;
var generateDescribe = require("./lib/generate");
var SETUP_METHODS = generateDescribe.SETUP_METHODS;
var IT_METHODS = generateDescribe.IT_METHODS;
var THAT_METHODS = generateDescribe.THAT_METHODS;
var _ = require("underscore");
var utils = require("./lib/utils");

_.defaults(global,{
   describeMethod: "describe",
   xdescribeMethod: "xdescribe",
   beforeMethod: "before",
   beforeEachMethod: "beforeEach",
   afterMethod: "after",
   afterEachMethod: "afterEach",
   itMethod: "it",
   xitMethod: "xit"
});

global.thatMethod = global.itMethod;
global.xthatMethod = global.xitMethod;

module.exports = function(name,ctx,f) {

    // Jasmine fallback

    if (global.beforeMethod == "before" && !global.hasOwnProperty("before") && global.hasOwnProperty("beforeAll")) {
        global.beforeMethod = "beforeAll";
    }

    if (global.afterMethod == "after" && !global.hasOwnProperty("after") && global.hasOwnProperty("afterAll")) {
        global.afterMethod = "afterAll";
    }

    if (!global.hasOwnProperty("describe")) {
        throw Error("There is no 'describe' method in your global. Probably mocha isn't running.");
    }

    if (name instanceof Function) {
        ctx = name;
        name = "";
    }

    if (ctx instanceof Function) {
        f = ctx;
        ctx = {};
    }

    if (ctx && !(ctx instanceof Object)) {
        throw Error("Second argument should be object if set");
    }
    if (f && !(f instanceof Function)) {
        throw Error("Third argument should be function if set");
    }

    name = name || "";

    var TestSuit = function Suit(msg,_ctx){
        if (utils.isSuitInstance(this)){
            if (msg instanceof Object) {
                _ctx = msg;
                msg = "";
            }

            msg = msg || "";

            var parents = [];
            var current = this.suit;

            while(utils.isSuit(current)) {
                parents.unshift(current);
                current = current.parent;
            }

            var ctx = this;
            var That = {__that: [], __xthat: []};
            parents.forEach(function(Suit){
                utils.extend(ctx,Suit.contextData);
                That.__that = That.__that.concat(Suit.__that || []);
                That.__xthat = That.__xthat.concat(Suit.__xthat || []);
            });

            utils.extend(ctx,_ctx);

            generateDescribe(parents,ctx,utils.dotEndString(msg),That);
        } else {
            utils.generateObject(TestSuit,arguments);
        }
    };

    utils.extendSuit(TestSuit,{
        parent: null,
        fcall: f,
        describe: name,
        contextData: ctx
    });

    SETUP_METHODS.forEach(function(callName){
        TestSuit[callName] = function(f) {
            if (utils.isSuit(f)) {
                utils.pushNewCall(this,callName, { suit: f });
            } else {
                utils.pushNewCall(this,callName, { fcall: f, useDone: fRegCheck.test(f) });
            }
            return this;
        };
    });

    IT_METHODS.concat(THAT_METHODS).forEach(function(callName){
        TestSuit[callName] = function(msg,f) {
            if (utils.isSuit(msg)) {
                utils.pushNewCall(this,callName, { suit: msg });
            } else {
                msg = String(msg);
                utils.pushNewCall(this,callName, { msg: msg, fcall: f, useDone: fRegCheck.test(f) });
            }
            return this;
        };
    });

    TestSuit.with = function(suit){
        if (!utils.isSuit(suit)) {
            throw Error("Argument should be Suit class object");
        }
        var self = this;
        SETUP_METHODS.concat(IT_METHODS).concat(THAT_METHODS).forEach(function(method){
            self[method](suit);
        });
        return this;
    };

    TestSuit.extend = function(msg,ctx,f) {
        if (ctx instanceof Function) {
            f = ctx;
            ctx = {};
        }
        if (ctx && !(ctx instanceof Object)) {
            throw Error("Second argument should be object if set");
        }
        if (f && !(f instanceof Function)) {
            throw Error("Third argument should be function if set");
        }

        msg = String(msg);
        var Parent = this;
        var NewSuit = function Suit() {
            if (utils.isSuitInstance(this)) {
                Parent.apply(this,arguments);
            }
            else {
                utils.generateObject(NewSuit,arguments);
            }
        };
        utils.extend(NewSuit,Parent);
        utils.extendSuit(NewSuit,{
            parent: Parent,
            fcall: f,
            describe: msg || "",
            contextData: ctx
        });
        return NewSuit;
    };

    TestSuit.xtend = function(msg,ctx,f) {
        var NewSuit = this.extend.apply(this,arguments);
        Object.defineProperty(NewSuit,"skip", {value: true});
        return NewSuit;
    };

    return TestSuit;
};