var extend = function(obj1,obj2) {
    obj2 = obj2 || {};
    Object.keys(obj2).forEach(function(key){
        obj1[key] = obj2[key];
    });
};

var fRegCheck = /^function\s+\(\S+?\)/;

var generateDescribe = function(list,ctx) {
    var Suit = list.shift();
    var describeString = String(Suit.describe);
    if (!/\.$/.test(describeString)) describeString += ".";

    describe(describeString,function(){
        this.suit = ctx;
        Suit.fcall && Suit.fcall.call(this);

        ["__before","__beforeEach","__after","__afterEach"].forEach(function(callName){
            var globalCall = callName.replace(/^__/,"");
            Suit[callName] && Suit[callName].forEach(function(f){
                if (f.useDone) {
                    global[globalCall](function(done) {
                        this.suit = ctx;
                        return f.fcall.call(this,done);
                    });
                } else {
                    global[globalCall](function() {
                        this.suit = ctx;
                        return f.fcall.call(this);
                    });
                }
            });
        });


        Suit.__it && Suit.__it.forEach(function(f){
            if (f.useDone) {
                it(f.msg,function(done) {
                    this.suit = ctx;
                    return f.fcall.call(this,done);
                });
            } else {
                it(f.msg,function() {
                    this.suit = ctx;
                    return f.fcall.call(this);
                });
            }
        });

        if (list.length > 0) {
            generateDescribe(list,ctx);
        }
    });
};

module.exports = function(name,f) {
    if (!global.hasOwnProperty("describe")) {
        throw Error("There is no 'describe' method in your global. Probably mocha isn't running.");
    }

    if (name instanceof Function) {
        f = name;
        name = "";
    }

    name = name || "";

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
        if (!(args.fcall instanceof Function)) {
            throw Error((callName == "it"?"Second argument":"Argument")+" should be test case method");
        }
        var containerName = "__"+callName;
        if (!(Suit[containerName] instanceof  Array)){
            Object.defineProperty(Suit,containerName,{value: [], writable: false, enumerable: false});
        }
        Suit[containerName].push(args);
    };

    TestSuit.describe = name;
    TestSuit.fcall = f;
    TestSuit.parent = null;
    TestSuit.contextData = {};

    TestSuit.prototype.suit = TestSuit;

    TestSuit.before = function(f) {
        pushNewCall(this,"before", { fcall: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.beforeEach = function(f) {
        pushNewCall(this,"beforeEach", { fcall: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.after = function(f) {
        pushNewCall(this,"after", { fcall: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.afterEach = function(f) {
        pushNewCall(this,"afterEach", { fcall: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.it = function(msg,f) {
        msg = String(msg);
        pushNewCall(this,"it", { msg: msg, fcall: f, useDone: fRegCheck.test(f) });
    };

    TestSuit.extend = function(msg,ctx,f) {
        msg = String(msg);
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
        var NewCase = function() { Parent.apply(this,arguments); };
        extend(NewCase,Parent);
        NewCase.prototype.suit = NewCase;
        NewCase.parent = Parent;
        NewCase.fcall = f;
        NewCase.describe = msg || "";
        NewCase.contextData = ctx;
        return NewCase;
    };

    return TestSuit;
};