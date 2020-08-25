'use strict';

const SUIT_PROPERTY = "__suit__";
const SUIT_BOUND_PROPERTY = "__boundTo__";

exports.dotEndString = function(str){
    if (str.length > 0 && !/\.$/.test(str)) {
        return  str+'.';
    } else {
        return str;
    }
};

exports.pushNewCall = function(Suit,callName,args) {
    var containerName = "__"+callName;
    if (!(Suit[containerName] instanceof Array)){
        Object.defineProperty(Suit,containerName,{value: [], writable: false, enumerable: false});
    }
    Suit[containerName].push(args);
};

exports.getCallList = function(Suit,callName) {
    var containerName = "__"+callName;
    return Suit[containerName];
};

exports.extendSuit = function(Suit,descr) {
    Object.keys(descr).forEach(function(key){
        Object.defineProperty(Suit,key,{value: descr[key], enumerable: false, writable: false});
    });
    Object.defineProperty(Suit.prototype,SUIT_PROPERTY,{value: Suit, enumerable: false, writable: false});
};

exports.extend = function(obj1,obj2) {
    obj2 = obj2 || {};
    Object.keys(obj2).forEach(function(key){
        obj1[key] = obj2[key];
    });
};

exports.bindTo = function(Suit,obj) {
    if (!this.isSuit(Suit)) {
        throw Error("First argument should be a Suit");
    }
    Object.defineProperty(Suit,SUIT_BOUND_PROPERTY,{ value: obj, enumerable: false, configurable: true, writable: false });
};

exports.getSuitContextObject = function(Suit, ctx) {
    var boundTo = exports.boundTo(Suit), suitContext;
    if (boundTo) {
        if (boundTo instanceof Function) {
            suitContext = boundTo(ctx);
        } else {
            suitContext = boundTo;
        }
    } else {
        suitContext = ctx;
    }
    return suitContext;
};

exports.unbind = function(Suit) {
    if (!this.isSuit(Suit)) {
        throw Error("First argument should be a Suit");
    }
    Object.defineProperty(Suit,SUIT_BOUND_PROPERTY,{ value: undefined, enumerable: false, configurable: true, writable: false });
};

exports.boundTo = function(Suit) {
    if (!this.isSuit(Suit)) {
        throw Error("First argument should be a Suit");
    }
    return Suit[SUIT_BOUND_PROPERTY];
};

exports.isSuit = function(obj){
    return (obj instanceof Function) && (obj.prototype.hasOwnProperty(SUIT_PROPERTY));
};

exports.isSuitInstance = function(obj){
    return (obj instanceof Object) && (obj[SUIT_PROPERTY] instanceof Function) && (obj instanceof obj[SUIT_PROPERTY]);
};

exports.generateObject = function(Suit,args){
    if (args[0] instanceof Array) {
        args[0].forEach(function(el){
            new (Suit.bind.apply(Suit,[null,el]));
        });
    } else if (args[0] instanceof Object && args[0].hasOwnProperty("testSet")) {
        var ctxSet = args[0];
        delete ctxSet["testSet"];
        Object.keys(ctxSet).forEach(function(key){
            new (Suit.bind.apply(Suit,[null,key,ctxSet[key]]));
        });
    } else {
        args = [].slice.call(args);
        args.unshift(null);
        new (Suit.bind.apply(Suit,args));
    }
};

exports.SUIT_PROPERTY = SUIT_PROPERTY;
