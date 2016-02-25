'use strict;'

describe("Check mocha methods call",function(){
    var mod = require("../../app");

    describe("Describe.",function(){
        describe("Base Suit generation.",function(){
            before(ResetSpyMethods);

            before(function(){
                this.suit = mod();
                this.suit();
            });

            before(RunSpyMethods);

            it("One describe block should be generated.",function(){
                test_describe.calledTimes().should.be.eql(1);
            });
        });

        describe("Describe with extend.",function(){
            before(ResetSpyMethods);

            before(function(){
                this.suit = mod();
                this.suit = this.suit.extend();
                this.suit();
            });

            before(RunSpyMethods);

            it("Two describe blocks should be generated.",function(){
                test_describe.calledTimes().should.be.eql(2);
            });
        });

        describe("Describe with double extend.",function(){
            before(ResetSpyMethods);

            before(function(){
                this.suit = mod();
                this.suit = this.suit.extend();
                this.suit = this.suit.extend();
                this.suit();
            });

            before(RunSpyMethods);

            it("Three describe blocks should be generated.",function(){
                test_describe.calledTimes().should.be.eql(3);
            });
        });
    });

    var runSetup = function(d){
        describe(d.describe,function(){
            before(ResetSpyMethods);

            before(function(){
                this.suit = mod();
                this.spies = [];
                for(var i = 0; i < d.times; i++) {
                    var spy = sinon.spy();
                    this.spies.push(spy);
                    this.suit[d.method](spy);
                }

                this.suit();
            });

            before(RunSpyMethods);

            it(d.method + " should be called once",function(){
                global["test_"+ d.method].calledTimes().should.be.eql(d.times);
            });

            it(d.method + " spy should be called",function(){
                for(var i = 0; i < d.times; i++) {
                    this.spies[i].called.should.be.true();
                }
            });
        });
    };

    ["before","beforeEach","after","afterEach"].forEach(function(method){
        runSetup({ method: method, describe: capitalize(method), times: 10});
    });

    var runIt = function(d){
        describe(d.describe,function(){
            before(ResetSpyMethods);

            before(function(){
                this.suit = mod();
                this.spies = [];
                for(var i = 0; i < d.times; i++) {
                    var spy = sinon.spy();
                    this.spies.push(spy);
                    this.suit[d.method]("",spy);
                }

                this.suit();
            });

            before(RunSpyMethods);

            it(d.toBeCalled + " should be called once",function(){
                global["test_"+ d.toBeCalled].calledTimes().should.be.eql(d.times);
            });

            it(d.toBeCalled + " spy should be called",function(){
                for(var i = 0; i < d.times; i++) {
                    this.spies[i].called.should.be.true();
                }
            });
        });
    };

    [
        {method: "that", toBeCalled: "it"},
        {method: "xthat", toBeCalled: "xit"},
        {method: "it", toBeCalled: "it"},
        {method: "xit", toBeCalled: "xit"}
    ].forEach(function(descr){
        descr.describe = capitalize(descr.method);
        descr.times = 10;
        runIt(descr);
    });
});