'use strict';

global.NormalizeTests();

var MSG = "Suit chaining.";

describe(MSG,function(){
    var mod = require("../../app");

    var setMethods = function(s) {
        s.before(function(){});
        s.it("",function(){});
        s.xit("",function(){});
        s.that("",function(){});
        s.xthat("",function(){});
        s.after(function(){});
    };

    before(function(){
        this.suit = mod();
        setMethods(this.suit);
        this.helperSuit = mod();
        setMethods(this.helperSuit);
        this.targetSuit = this.suit.extend();
        setMethods(this.targetSuit);
        this.suit.with(this.helperSuit);
        this.targetSuit.with(this.helperSuit);
        this.targetSuit();
    });

    before(RunSpyMethods);

    it("it should called from target it and that && base that",function(){
        // that from suit, that from helperSuit
        // that from targetSuit, that from targetHelperSuit
        // it from targetSuit, it from targetHelperSuit
        test_it.calledTimes().should.be.eql(6);
    });

    it("xit should called from target xit and xthat && base xthat",function(){
        // xthat from suit, xthat from helperSuit
        // xthat from targetSuit, xthat from targetHelperSuit
        // xit from targetSuit, xit from targetHelperSuit
        test_xit.calledTimes().should.be.eql(6);
    });

    after(ResetSpyMethods);
});