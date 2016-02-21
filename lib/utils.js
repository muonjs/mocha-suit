'use strict';

exports.dotEndString = function(str){
    if (str.length > 0 && !/\.$/.test(str)) {
        return  str+'.';
    } else {
        return str;
    }
};

exports.pushNewCall = function(Suit,callName,args) {
    var containerName = "__"+callName;
    if (!(Suit[containerName] instanceof  Array)){
        Object.defineProperty(Suit,containerName,{value: [], writable: false, enumerable: false});
    }
    Suit[containerName].push(args);
};

exports.extendSuit = function(Suit,descr) {
    Object.keys(descr).forEach(function(key){
        Object.defineProperty(Suit,key,{value: descr[key], enumerable: false, writable: false});
    });
    Object.defineProperty(Suit.prototype,"suit",{value: Suit, enumerable: false, writable: false});
};

exports.extend = function(obj1,obj2) {
    obj2 = obj2 || {};
    Object.keys(obj2).forEach(function(key){
        obj1[key] = obj2[key];
    });
};

exports.isSuit = function(obj){
    return (obj instanceof Function) && (obj.prototype.hasOwnProperty("suit"));
};

exports.isSuitInstance = function(obj){
    return (obj instanceof Object) && (obj.suit instanceof Function) && (obj instanceof obj.suit);
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