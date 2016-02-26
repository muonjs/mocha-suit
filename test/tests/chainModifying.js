'use strict';

NormalizeTests();

describe("Modifying suit chain with set/reset methods.",function(){
    var mod = require("../../app");

    describe("Normal chain execution check.",function(){
        before(ResetSpyMethods);

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
    });

    [{
        method: "setBefore",
        baseMethod: "before"
    },{
        method: "setBeforeAll",
        baseMethod: "beforeAll"
    }].forEach(function(d){
        describe(d.method+" execution check.",function() {
            before(ResetSpyMethods);

            before(function () {
                var self = this;
                this.suit = mod();
                this.suit2 = this.suit.extend("");
                this.suit3 = this.suit2.extend("");
                this.suit4 = this.suit3.extend("");
                this.suit5 = this.suit4.extend("");
                this.beforeCallStack = [];

                this.suit[d.baseMethod](function () {
                    self.beforeCallStack.push(1);
                });

                this.suit2[d.baseMethod](function () {
                    self.beforeCallStack.push(2);
                });

                this.suit3[d.baseMethod](function () {
                    self.beforeCallStack.push(3);
                });

                this.suit4[d.baseMethod](function () {
                    self.beforeCallStack.push(4);
                });

                this.suit5[d.baseMethod](function () {
                    self.beforeCallStack.push(5);
                });

                this.suit3[d.method](this.suit2, function () {
                    self.beforeCallStack.push(31);
                });

                // not setBefore calls are not properly ordered

                this.suit5[d.method](this.suit2, function () {
                    self.beforeCallStack.push(51);
                });

                this.suit4[d.method](this.suit2, function () {
                    self.beforeCallStack.push(41);
                });
                this.suit4[d.method](this.suit2, function () {
                    self.beforeCallStack.push(42);
                });
            });

            before(function () {
                this.suit5();
            });

            before(RunSpyMethods);

            it("before call stack should have inserted calls before second suit", function () {
                this.beforeCallStack.should.be.eql([1, 51, 41, 42, 31, 2, 3, 4, 5]);
            });
        });
    });

    [{
        method: "setAfter",
        baseMethod: "after"
    },{
        method: "setAfterAll",
        baseMethod: "afterAll"
    }].forEach(function(d){
        describe(d.method+" execution check.",function() {
            before(ResetSpyMethods);

            before(function () {
                var self = this;
                this.suit = mod();
                this.suit2 = this.suit.extend("");
                this.suit3 = this.suit2.extend("");
                this.suit4 = this.suit3.extend("");
                this.suit5 = this.suit4.extend("");
                this.afterCallStack = [];

                this.suit[d.baseMethod](function () {
                    self.afterCallStack.push(1);
                });

                this.suit2[d.baseMethod](function () {
                    self.afterCallStack.push(2);
                });

                this.suit3[d.baseMethod](function () {
                    self.afterCallStack.push(3);
                });

                this.suit4[d.baseMethod](function () {
                    self.afterCallStack.push(4);
                });

                this.suit5[d.baseMethod](function () {
                    self.afterCallStack.push(5);
                });

                this.suit3[d.method](this.suit2, function () {
                    self.afterCallStack.push(31);
                });

                // not setBefore calls are not properly ordered

                this.suit5[d.method](this.suit2, function () {
                    self.afterCallStack.push(51);
                });

                this.suit4[d.method](this.suit2, function () {
                    self.afterCallStack.push(41);
                });
                this.suit4[d.method](this.suit2, function () {
                    self.afterCallStack.push(42);
                });
            });

            before(function () {
                this.suit5();
            });

            before(RunSpyMethods);

            it("after call stack should have inserted calls after second suit", function () {
                this.afterCallStack.should.be.eql([1, 2, 31, 41, 42, 51, 3, 4, 5]);
            });
        });
    });

    describe("replaceWith execution check.",function() {
        before(ResetSpyMethods);

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
                self.beforeCallStack.push(4);
            }).beforeAll(function(){
                self.beforeAllCallStack.push(4);
            }).after(function(){
                self.afterCallStack.push(4);
            }).afterAll(function(){
                self.afterAllCallStack.push(4);
            });

            this.suit3.replaceWith(this.suit2,this.replacer);

            this.suit3.setBefore(this.suit2,function(){
                self.beforeCallStack.push(21);
            })
            this.suit3.setBefore(this.replacer,function(){
                self.beforeCallStack.push(41);
            })
            this.suit3.setAfter(this.suit2,function(){
                self.afterCallStack.push(21);
            })
            this.suit3.setAfter(this.replacer,function(){
                self.afterCallStack.push(41);
            })
        });

        before(function () {
            this.suit3();
        });

        before(RunSpyMethods);

        it("before call stack should have inserted calls before second suit", function () {
            this.beforeCallStack.should.be.eql([1, 21, 4, 3]);
            this.beforeAllCallStack.should.be.eql([1, 4, 3]);
            this.afterCallStack.should.be.eql([1, 4, 21, 3]);
            this.afterAllCallStack.should.be.eql([1, 4, 3]);
        });
    });
});