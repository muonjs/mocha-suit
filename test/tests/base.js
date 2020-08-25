'use strict';

global.NormalizeTests();

var MSG = "Base system test.";

describe(MSG,function(){
    var mod = require('../../app');
    var run = function(){
        it("Suit should have all base factory methods.",function(){
            var self = this;
            self.suit.should.have.property("name","Suit");
            [
                "extend",
                "before","beforeEach","beforeAll",
                "after","afterEach","afterAll",
                "it","xit",
                "that","xthat",
                "with","replaceWith",
                "insertAbove","insertBelow",
            ].forEach(function(prop){
                self.suit.should.have.property(prop).which.is.a.Function();
            });
        });

        it("Setup methods should return suit itself.",function(){
            var self = this;
            [
                "before","beforeEach","beforeAll",
                "after","afterEach","afterAll"
            ].forEach(function(prop){
                var ret = self.suit[prop](function(){});
                ret.should.be.eql(self.suit);
            });
        });

        it("Test methods should return suit itself.",function(){
            var self = this;
            [
                "it","xit",
                "that","xthat"
            ].forEach(function(prop){
                var ret = self.suit[prop]("msg",function(){});
                ret.should.be.eql(self.suit);
            });
        });

        it("insertAbove/insertBelow methods should return suit itself.",function(){
            var self = this;
            [
                "insertAbove","insertBelow"
            ].forEach(function(prop){
                var ret = self.suit[prop](self.suit,self.helperSuit);
                ret.should.be.eql(self.suit);
            });
        });

        it("with/replace methods should return suit itself.",function(){
            var self = this;
            [
                "with","replaceWith"
            ].forEach(function(prop){
                var ret = self.suit[prop](self.suit,self.suit);
                ret.should.be.eql(self.suit);
            });
        });
    };

    describe("Generated suit",function(){
        before(function(){
            this.suit = mod();
            this.helperSuit = mod();
        });
        run();
        it("Suit parent should be null",function(){
            expect(this.suit.parent).to.eql(null);
        });
    });

    describe("Extended suit",function(){
        before(function(){
            this.parent = mod();
            this.suit = this.parent.extend("some");
            this.helperSuit = mod();
        });
        run();
        it("Suit parent should be null",function(){
            expect(this.suit.parent).to.eql(this.parent);
        });
    });
});
