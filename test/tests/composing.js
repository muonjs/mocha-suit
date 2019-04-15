'use strict';

global.NormalizeTests();

var MSG = "Composing Suit.";

describe(MSG,function(){
    var mod = require("../../app");

    ["before","beforeEach","beforeAll","after","afterAll","afterEach"].forEach(function(method){
        describe(capitalize(method)+".",function(){
            before(ResetSpyMethods);

            before(function() {
                this.suit = mod();
                this.helperSuit = mod();
                this.helperSpy = sinon.spy();
                this.helperSuit[method](this.helperSpy);

                this.suit.before(function(){});
                this.suit.beforeEach(function(){});
                this.suit.beforeAll(function(){});
                this.suit.after(function(){});
                this.suit.afterEach(function(){});
                this.suit.afterAll(function(){});
                this.suit.it("",function(){});
                this.suit.xit("",function(){});
                this.suit.that("",function(){});
                this.suit.xthat("",function(){});

                this.suit[method](this.helperSuit);
                this.suit();
            });

            before(RunSpyMethods);

            it(method+" should be run twice",function(){
                global["test_"+method].calledTimes().should.be.eql(2);
                this.helperSpy.called.should.be.true()
            });
        });
    });

    ["it","xit","that","xthat"].forEach(function(method){
        describe(capitalize(method)+".",function(){
            before(ResetSpyMethods);

            before(function() {
                this.suit = mod();
                this.helperSuit = mod();
                this.helperSpy = sinon.spy();
                this.helperSuit[method]("",this.helperSpy);

                this.suit.before(function(){});
                this.suit.beforeEach(function(){});
                this.suit.after(function(){});
                this.suit.afterEach(function(){});
                this.suit.it("",function(){});
                this.suit.xit("",function(){});
                this.suit.that("",function(){});
                this.suit.xthat("",function(){});

                this.suit[method](this.helperSuit);
                this.suit();
            });

            before(RunSpyMethods);

            it(method+" should be run twice",function(){
                if (/^x/.test(method)) {
                    global.test_xit.calledTimes().should.be.eql(3);
                } else {
                    global.test_it.calledTimes().should.be.eql(3);
                }
                this.helperSpy.called.should.be.true()
            });
        });
    });

    describe("With.",function(){
        before(ResetSpyMethods);

        before(function(){
            this.helperSuit = mod();

            this.beforeSpy = sinon.spy();
            this.helperSuit.before(this.beforeSpy);

            this.beforeEachSpy = sinon.spy();
            this.helperSuit.beforeEach(this.beforeEachSpy);

            this.beforeAllSpy = sinon.spy();
            this.helperSuit.beforeAll(this.beforeAllSpy);

            this.afterSpy = sinon.spy();
            this.helperSuit.after(this.afterSpy);

            this.afterEachSpy = sinon.spy();
            this.helperSuit.afterEach(this.afterEachSpy);

            this.afterAllSpy = sinon.spy();
            this.helperSuit.afterAll(this.afterAllSpy);

            this.itSpy = sinon.spy();
            this.helperSuit.it("",this.itSpy);

            this.xitSpy = sinon.spy();
            this.helperSuit.xit("",this.xitSpy);

            this.thatSpy = sinon.spy();
            this.helperSuit.that("",this.thatSpy);

            this.xthatSpy = sinon.spy();
            this.helperSuit.xthat("",this.xthatSpy);
        });

        before(function(){
            this.suit = mod();
            this.suit.before(function(){});
            this.suit.beforeEach(function(){});
            this.suit.beforeAll(function(){});
            this.suit.after(function(){});
            this.suit.afterEach(function(){});
            this.suit.afterAll(function(){});
            this.suit.it("",function(){});
            this.suit.xit("",function(){});
            this.suit.that("",function(){});
            this.suit.xthat("",function(){});

            this.suit.with(this.helperSuit);
            this.suit();
        });

        before(RunSpyMethods);

        it("before spy should be called",function(){
            this.beforeSpy.called.should.be.true();
        });

        it("beforeEach spy should be called",function(){
            this.beforeEachSpy.called.should.be.true();
        });

        it("beforeAll spy should be called",function(){
            this.beforeAllSpy.called.should.be.true();
        });

        it("after spy should be called",function(){
            this.afterSpy.called.should.be.true();
        });

        it("afterEach spy should be called",function(){
            this.afterEachSpy.called.should.be.true();
        });

        it("afterAll spy should be called",function(){
            this.afterAllSpy.called.should.be.true();
        });

        it("it spy should be called",function(){
            this.itSpy.called.should.be.true();
        });

        it("xit spy should be called",function(){
            this.xitSpy.called.should.be.true();
        });

        it("that spy should be called",function(){
            this.thatSpy.called.should.be.true();
        });

        it("xthat spy should be called",function(){
            this.xthatSpy.called.should.be.true();
        });
    });
});