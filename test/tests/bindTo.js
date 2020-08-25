describe("Test binding to specific external context (this) object",function() {
    var mod = require("../../app");

    describe("Testing simple binding with 'new' call",function() {
        var randomValue = Date.now();
        before(function() {
            this.externalTestContext = {};

            var Suit = mod();

            Suit.before(function() {
                this.externalProperty = randomValue;
            });
            Suit.bindTo(this.externalTestContext);

            new Suit();
        });

        before(RunSpyMethods);

        it("this withing suit call should refer to externalTestContext", function() {
            expect(this.externalTestContext).to.have.property("externalProperty",randomValue);
        });

        after(ResetSpyMethods);
    });

    describe("Testing simple binding with factory call",function() {
        var randomValue = Date.now();
        before(function() {
            this.externalTestContext = {};

            var Suit = mod();

            Suit.before(function() {
                this.externalProperty = randomValue;
            });
            Suit.bindTo(this.externalTestContext);

            Suit();
        });

        before(RunSpyMethods);

        it("this withing suit call should refer to externalTestContext", function() {
            expect(this.externalTestContext).to.have.property("externalProperty",randomValue);
        });

        after(ResetSpyMethods);
    });

    describe("External context should refer to itself with 'suit' property",function() {
        before(function() {
            var self = this;

            this.externalTestContext = {};

            var Suit = mod();
            this.Suit = Suit;

            Suit.before(function() {
                self.originalSuitObject = this.suit;
            });
            Suit.bindTo(this.externalTestContext);

            new Suit();
        });

        before(RunSpyMethods);

        it("expect 'suit' property of external context should refer to itself", function() {
            expect(this.originalSuitObject).to.be(this.externalTestContext);
        });

        after(ResetSpyMethods);
    });

    describe("Binding external context to helper",function() {
        before(function() {
            var self = this;

            this.externalTestContext = {};

            var Suit = mod();
            var Helper = mod();

            this.Suit = Suit;

            Helper.before(function() {
                self.helperObject = this;
                self.helperSuitReference = this.suit;
            });
            Suit.before(function() {
                self.suitObject = this;
                self.suitReference = this.suit;
            });

            Helper.bindTo(this.externalTestContext);

            Suit.with(Helper);

            new Suit();
        });

        before(RunSpyMethods);

        it("helper object should be an external test context", function() {
            expect(this.helperObject).to.be(this.externalTestContext);
        });

        it("suit object should be a Suit object", function() {
            expect(this.suitObject).to.be(this.suitReference);
        });

        it("helper suit property should refer to Suit object", function() {
            expect(this.helperSuitReference).to.be(this.suitObject);
        });

        it("suit self property should refer to itself", function() {
            expect(this.suitReference).to.be(this.suitObject);
        });

        after(ResetSpyMethods);
    });

    describe("Unbinding external context",function() {
        before(function() {
            var self = this;

            this.externalTestContext = {};

            var Suit = mod();
            this.Suit = Suit;

            Suit.before(function() {
                self.cachedSuitContext = this;
            });
            Suit.bindTo(this.externalTestContext);

            new Suit();
        });

        before(function() {
            var Suit = this.Suit;

            Suit.unbind();

            new Suit();
        });

        before(RunSpyMethods);

        it("expect 'suit' property of external context should be instance of Suit", function() {
            expect(this.cachedSuitContext).not.to.be(this.externalProperty);
        });

        after(ResetSpyMethods);
    });
});
