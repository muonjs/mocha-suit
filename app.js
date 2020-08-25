'use strict';

var generateDescribe = require("./lib/generate");
var SETUP_METHODS = generateDescribe.SETUP_METHODS;
var IT_METHODS = generateDescribe.IT_METHODS;
var THAT_METHODS = generateDescribe.THAT_METHODS;
var SET_METHODS = generateDescribe.SET_METHODS;
var REPLACE_METHOD = generateDescribe.REPLACE_METHOD;
var _ = require("underscore");
var utils = require("./lib/utils");

var Module = function(name,ctx,f) {

    // Jasmine fallback

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
            var CurrentSuit = this[utils.SUIT_PROPERTY];
            var ctx = utils.getSuitContextObject(CurrentSuit,{});

            while(utils.isSuit(CurrentSuit)) {
                parents.unshift(CurrentSuit);
                CurrentSuit = CurrentSuit.parent;
            }

            var modifiers = {
                insertAbove: [],
                insertBelow: [],
                replaceWith: []
            };

            parents.forEach(function(Suit){
                utils.extend(ctx,Suit.contextData);
                modifiers.insertAbove = (Suit.__insertAbove || []).concat(modifiers.insertAbove);
                modifiers.insertBelow = modifiers.insertBelow.concat(Suit.__insertBelow || []);
                modifiers.replaceWith = (Suit.__replaceWith || []).concat(modifiers.replaceWith);
            });

            utils.extend(ctx,_ctx);

            generateDescribe(parents,ctx,utils.dotEndString(msg),modifiers);
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
        TestSuit[callName] = function(a,b) {
            if (utils.isSuit(a)) {
                utils.pushNewCall(this,callName, { suit: a, args: b });
            } else {
                utils.pushNewCall(this,callName, { fcall: a });
            }
            return this;
        };
    });

    IT_METHODS.concat(THAT_METHODS).forEach(function(callName){
        TestSuit[callName] = function(a,b) {
            if (utils.isSuit(a)) {
                utils.pushNewCall(this,callName, { suit: a, args: b });
            } else {
                a = String(a);
                utils.pushNewCall(this,callName, { msg: a, fcall: b });
            }
            return this;
        };
    });

    SET_METHODS.forEach(function(callName) {
        TestSuit[callName] = function(suit,newSuit, args){
            if (!utils.isSuit(suit)) {
                throw new Error(callName+" first argument should be suit");
            }
            if (!utils.isSuit(newSuit)) {
                throw new Error(callName +" second argument should be suit");
            }
            utils.pushNewCall(this,callName, { targetSuit: suit, newSuit: newSuit, args: args });
            return this;
        };
    });

    TestSuit.replaceWith = function(suit,newSuit,args){
        if (!utils.isSuit(suit)) {
            throw new Error("replaceWith first argument should be suit");
        }
        if (!utils.isSuit(newSuit)) {
            throw new Error("replaceWith second argument should be suit");
        }
        utils.pushNewCall(this,"replaceWith", { targetSuit: suit, newSuit: newSuit, args: args });
        return this;
    };

    TestSuit.with = function(suit,args){
        if (!utils.isSuit(suit)) {
            throw Error("Argument should be Suit class object");
        }
        var self = this;
        SETUP_METHODS.concat(IT_METHODS).concat(THAT_METHODS).forEach(function(method){
            self[method](suit,args);
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

    TestSuit.bindTo = function(obj) {
        utils.bindTo(this,obj);
    };


    TestSuit.unbind = function() {
        utils.unbind(this);
    };

    TestSuit.copy = function() {
        var NewSuit = Module();
        var OldSuit = this;
        Object.keys(OldSuit).forEach(function(key) {
            (utils.getCallList(OldSuit,key) || []).forEach(function(f) {
                var newDescriptor = Object.assign({},f);
                if (newDescriptor.newSuit) {
                    newDescriptor.newSuit = newDescriptor.newSuit.copy();
                }
                if (newDescriptor.suit) {
                    newDescriptor.suit = newDescriptor.suit.copy();
                }
                utils.pushNewCall(NewSuit,key,newDescriptor);
            });
        });
        NewSuit.bindTo(utils.boundTo(OldSuit));
        return NewSuit;
    };

    return TestSuit;
};

module.exports = Module;
