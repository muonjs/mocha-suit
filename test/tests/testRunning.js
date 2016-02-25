'use strict';

global.NormalizeTests();

describe("Test running",function(){
    var mod = require("../../app");

    var createSuit = function(){
        before(function() {
            this.suit = mod();
            this.spy = sinon.spy();
            this.suit.it("", this.spy);
        });
    };

    describe("With new",function(){
        before(ResetSpyMethods);

        createSuit();

        before(function(){
            new this.suit();
        });

        before(RunSpyMethods);

        it("spy should be called",function(){
            this.spy.called.should.be.true();
        });
    });

    describe("With simple call",function(){
        before(ResetSpyMethods);

        createSuit();

        before(function(){
            this.suit();
        });

        before(RunSpyMethods);

        it("spy should be called",function(){
            this.spy.called.should.be.true();
        });
    });

    describe("With simple call under array of context objects",function(){
        before(ResetSpyMethods);

        const TIMES = 10;

        createSuit();

        before(function(){
            var ctxSet = [];
            for(var i = 0; i < TIMES; i++) {
                ctxSet.push({});
            }
            this.suit(ctxSet);
        });

        before(RunSpyMethods);

        it("spy should be called",function(){
            this.spy.called.should.be.true();
            global.test_it.calledTimes().should.be.eql(TIMES);
        });
    });

    describe("With simple call with testSet",function(){
        before(ResetSpyMethods);

        const TIMES = 10;

        createSuit();

        before(function(){
            var ctxSet = {};
            for(var i = 0; i < TIMES; i++) {
                ctxSet[i]  = {};
            }
            ctxSet.testSet = true;
            this.suit(ctxSet);
        });

        before(RunSpyMethods);

        it("spy should be called",function(){
            this.spy.called.should.be.true();
            global.test_it.calledTimes().should.be.eql(TIMES);
        });
    });
});