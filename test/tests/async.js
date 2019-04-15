'use strict';

global.NormalizeTests();

var DELAY = 10;
var Promise = require("bluebird");

var MSG = "Asynchronous methods.";

describe(MSG,function(){
    var mod = require("../../app");

    describe("With 'done' argument.",function(){
        ["before","after","beforeEach","afterEach","beforeAll","afterAll","it"].forEach(function(method){
            describe(capitalize(method)+".",function(){
                before(function() {
                    var self = this;
                    this.suit = mod();
                    this.callOrder = [];

                    var call1 = function call1(done){
                        setTimeout(function(){
                            self.callOrder.push(1);
                            done();
                        },DELAY);
                    };

                    var call2 = function(){
                        self.callOrder.push(2);
                    };

                    if (method === "it") {
                        this.suit[method]("",call1);
                        this.suit[method]("",call2);
                    } else {
                        this.suit[method](call1);
                        this.suit[method](call2);
                    }

                    this.suit();
                });

                before(RunSpyMethods);

                before(function(done){
                    // since mocha methods are spied we need to wait until first timeout is called
                    setTimeout(done,DELAY*2);
                });

                it("methods should be called in reverse order",function(){
                    this.callOrder.should.be.eql([2,1]);
                });

                it("Mochas done arguments from first call should be run",function(){
                    var doneMethod = global["test_"+method].doneMethod(0);
                    expect(doneMethod).to.be.ok();
                    expect(doneMethod.called).to.be.ok();
                });

                after(ResetSpyMethods);
            });
        });
    });

    describe("With Promises",function(){
        ["before","after","beforeEach","afterEach","it"].forEach(function(method){
            describe(capitalize(method)+".",function(){
                before(function() {
                    this.suit = mod();

                    var call = function(){
                        return Promise.delay(DELAY);
                    };

                    if (method === "it") {
                        this.suit[method]("",call);
                    } else {
                        this.suit[method](call);
                    }

                    this.suit();
                });

                before(RunSpyMethods);

                before(function(done){
                    // since mocha methods are spied we need to wait until first timeout is called
                    setTimeout(done,DELAY*2);
                });

                it("Mochas done arguments from first call should be run",function(){
                    var returned = global["test_"+method].returned(0);
                    expect(returned).to.be.ok();
                    expect(returned.then).to.be.ok();
                    returned.then.should.be.Function();
                });

                after(ResetSpyMethods);
            });
        });
    });
});