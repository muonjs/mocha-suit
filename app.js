var extend = function(obj1,obj2) {
    obj2 = obj2 || {};
    Object.keys(obj2).forEach(function(key){
        obj1[key] = obj2[key];
    });
};

var fRegCheck = /^function\s+\(\S+?\)/;

var generateDescribe = function(list,ctx) {
    var Suit = list.shift();
    var f = function() {

        this.ctx = ctx;
        Suit.call && Suit.call.call(this);


        ["__before","__beforeEach","__after","__afterEach"].forEach(function(callName){
            var globalCall = callName.replace(/^__/,"");
            Suit[callName] && Suit[callName].forEach(function(f){
                if (f.useDone) {
                    global[globalCall](function(done) {
                        this.ctx = ctx;
                        return f.call.call(this,done);
                    });
                } else {
                    global[globalCall](function() {
                        this.ctx = ctx;
                        return f.call.call(this);
                    });
                }
            });
        });


        Suit.__it && Suit.__it.forEach(function(f){
            if (f.useDone) {
                it(f.msg,function(done) {
                    this.ctx = ctx;
                    return f.call.call(this,done);
                });
            } else {
                it(f.msg,function() {
                    this.ctx = ctx;
                    return f.call.call(this);
                });
            }
        });

        if (list.length > 0) {
            generateDescribe(list,ctx);
        }
    };

    describe(Suit.describe.toString(),function(){
        extend(this);
        extend(this,ctx);
        f.apply(this,arguments);
    });
};

module.exports = function(name) {
    var TestSuit = function(_ctx){
        if (!(this instanceof this.suit)){
            return;
        }
        else {
            var parents = [];
            var current = this.suit;
            while(current instanceof Function) {
                parents.unshift(current);
                current = current.parent;
            }

            var ctx = {};
            parents.forEach(function(Suit){
                extend(ctx,Suit.contextData);
            });
            extend(ctx,_ctx);

            generateDescribe(parents,ctx);
        }
    };

    var pushNewCall = function(Suit,callName,args) {
        if (!(args.call instanceof Function)) {
            throw Error((callName == "it"?"Second argument":"Argument")+" should be test case method");
        }
        var containerName = "__"+callName;
        if (!(Suit[containerName] instanceof  Array)){
            Object.defineProperty(Suit,containerName,{value: [], writable: false, enumerable: false});
        }
        Suit[containerName].push(args);
    };

    TestSuit.describe = name || "";
    TestSuit.parent = null;
    TestSuit.contextData = {};

    TestSuit.prototype.suit = TestSuit;

    TestSuit.before = function(f) {
        pushNewCall(this,"before", { call: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.beforeEach = function(f) {
        pushNewCall(this,"beforeEach", { call: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.after = function(f) {
        pushNewCall(this,"after", { call: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.afterEach = function(f) {
        pushNewCall(this,"afterEach", { call: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.it = function(msg,f) {
        if (!(msg instanceof String)) {
            throw Error("First argument should be test case description (String)");
        }
        pushNewCall(this,"it", { msg: msg, call: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.extend = function(msg,ctx,f) {
        if (!(msg instanceof String)) {
            throw Error("First argument should be suit description (String)");
        }
        if (ctx && !(ctx instanceof Object)) {
            throw Error("Second argument should be object if set");
        }
        if (f && !(f instanceof Function)) {
            throw Error("Third argument should be function if set");
        }
        var Parent = this;
        var NewCase = function() { Parent.apply(this,arguments); };
        extend(NewCase,Parent);
        NewCase.prototype.suit = NewCase;
        NewCase.parent = Parent;
        NewCase.call = f;
        NewCase.describe = msg || "";
        if (!/\.$/.test(NewCase.describe)) NewCase.describe += ".";
        NewCase.contextData = ctx;
        return NewCase;
    };

    return TestSuit;
};