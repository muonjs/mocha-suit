'use strict';

exports.dotEndString = function(str){
    if (str.length > 0 && !/\.$/.test(str)) {
        return  str+'.';
    } else {
        return str;
    }
};

exports.pushNewCall = function(Suit,callName,args) {
    if (!(args.fcall instanceof Function)) {
        throw Error((callName == "it"?"Second argument":"Argument")+" should be test case method");
    }
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