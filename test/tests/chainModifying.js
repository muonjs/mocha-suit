'use strict';

NormalizeTests();

var MSG = "Modifying suit chain with set/reset methods.";

describe(MSG,function(){
    var mod = require("../../app");

    describe("Normal chain execution check.",function(){
        before(function() {
            var self = this;
            this.suit = mod();
            this.suit2 = this.suit.extend("");
            this.suit3 = this.suit2.extend("");
            this.beforeCallStack = [];
            this.afterCallStack = [];

            this.suit.before(function(){
                self.beforeCallStack.push(1);
            });
            this.suit.after(function(){
                self.afterCallStack.push(1);
            });

            this.suit2.before(function(){
                self.beforeCallStack.push(2);
            });
            this.suit2.after(function(){
                self.afterCallStack.push(2);
            });

            this.suit3.before(function(){
                self.beforeCallStack.push(3);
            });
            this.suit3.after(function(){
                self.afterCallStack.push(3);
            });
        });

        before(function(){
            this.suit3();
        });

        before(RunSpyMethods);

        it("before call stack should be in right order",function(){
            this.beforeCallStack.should.be.eql([1,2,3]);
        });

        it("after call stack should be in right order",function(){
            this.beforeCallStack.should.be.eql([1,2,3]);
        });

        after(ResetSpyMethods);
    });

    describe("insertAbove execution check.",function() {
        before(function () {
            var self = this;
            this.suit = mod();
            this.suit2 = this.suit.extend("");
            this.suit3 = this.suit2.extend("");
            this.suitHelper = mod();

            this.beforeCallStack = [];

            this.suitHelper.before(function() {
                self.beforeCallStack.push(0);
            });

            this.suit.before(function () {
                self.beforeCallStack.push(1);
            });

            this.suit2.before(function () {
                self.beforeCallStack.push(2);
            });

            this.suit3.before(function () {
                self.beforeCallStack.push(3);
            });

            this.suit3.insertAbove(this.suit2,this.suitHelper);

            this.suit3();
        });

        before(RunSpyMethods);

        it("before call stack should have inserted calls before second suit", function () {
            this.beforeCallStack.should.be.eql([1, 0, 2, 3]);
        });

        after(ResetSpyMethods);
    });

    describe("insertBelow execution check.",function() {
        before(function () {
            var self = this;
            this.suit = mod();
            this.suit2 = this.suit.extend("");
            this.suit3 = this.suit2.extend("");
            this.suitHelper = mod();

            this.beforeCallStack = [];

            this.suitHelper.before(function() {
                self.beforeCallStack.push(0);
            });

            this.suit.before(function () {
                self.beforeCallStack.push(1);
            });

            this.suit2.before(function () {
                self.beforeCallStack.push(2);
            });

            this.suit3.before(function () {
                self.beforeCallStack.push(3);
            });

            this.suit3.insertBelow(this.suit2,this.suitHelper);

            this.suit3();
        });

        before(RunSpyMethods);

        it("before call stack should have inserted calls before second suit", function () {
            this.beforeCallStack.should.be.eql([1, 2, 0, 3]);
        });

        after(ResetSpyMethods);
    });

    describe("replaceWith execution check.",function() {
        before(function () {
            var self = this;
            this.suit = mod();
            this.suit2 = this.suit.extend("");
            this.suit3 = this.suit2.extend("");
            this.replacer = mod();

            this.beforeCallStack = [];
            this.beforeAllCallStack = [];
            this.afterCallStack = [];
            this.afterAllCallStack = [];

            this.suit.before(function () {
                self.beforeCallStack.push(1);
            }).beforeAll(function(){
                self.beforeAllCallStack.push(1);
            }).after(function(){
                self.afterCallStack.push(1);
            }).afterAll(function(){
                self.afterAllCallStack.push(1);
            });

            this.suit2.before(function () {
                self.beforeCallStack.push(2);
            }).beforeAll(function(){
                self.beforeAllCallStack.push(2);
            }).after(function(){
                self.afterCallStack.push(2);
            }).afterAll(function(){
                self.afterAllCallStack.push(2);
            });

            this.suit3.before(function () {
                self.beforeCallStack.push(3);
            }).beforeAll(function(){
                self.beforeAllCallStack.push(3);
            }).after(function(){
                self.afterCallStack.push(3);
            }).afterAll(function(){
                self.afterAllCallStack.push(3);
            });

            this.replacer.before(function () {
                self.beforeCallStack.push(0);
            }).beforeAll(function(){
                self.beforeAllCallStack.push(0);
            }).after(function(){
                self.afterCallStack.push(0);
            }).afterAll(function(){
                self.afterAllCallStack.push(0);
            });

            this.suit3.replaceWith(this.suit2,this.replacer);
        });

        before(function () {
            this.suit3();
        });

        before(RunSpyMethods);

        it("before call stack should have inserted calls before second suit", function () {
            this.beforeCallStack.should.be.eql([1, 0, 3]);
        });

        it("beforeAll call stack should have inserted calls before second suit", function () {
            this.beforeAllCallStack.should.be.eql([1, 0, 3]);
        });

        after(ResetSpyMethods);
    });
});
