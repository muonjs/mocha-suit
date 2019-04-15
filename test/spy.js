'use strict';

var fRegCheck = /^function\s*\S*?\s*\(\S+?\)/;

module.exports = function(name){
    var args = [];
    var ret = [];
    var called = [];
    var done = [];

    var method = function(){
        args.push([].slice.call(arguments));
    };

    method.run = function(){
        var ctx = {};
        for(var _i = 0; _i < args.length; _i++) {
            (function(i){
                if (called[i]) {
                    return;
                }
                args[i].forEach(function(arg){
                    // console.log(1,(arg || "").toString(),);
                    if (arg instanceof Function) {
                        if (fRegCheck.test(arg.toString())) {
                            done[i] = function(){
                                done[i].called = true;
                            };
                            ret[i] = arg.call(ctx,done[i]);
                        } else {
                            done[i] = null;
                            ret[i] = arg.call(ctx);
                        }
                    }
                    called[i] = true;
                });
            })(_i);
        }
    };

    method.reset = function(){
        args = [];
        ret = [];
        done = [];
        called = [];
    };

    method.calledTimes = function(){
        return args.length;
    };

    method.isCalled = function(i){
        return called[i] === true;
    };

    method.calledWith = function(i){
        return args[i];
    };
    method.returned = function(i){
        return ret[i];
    };
    method.doneMethod = function(i){
        return done[i];
    };

    return method;
};