var _ = require("underscore");
var mod = {};

_.extend(mod,{
    describeMethod: "describe",
    xdescribeMethod: "xdescribe",
    beforeMethod: "before",
    beforeAllMethod: "beforeAll",
    beforeEachMethod: "beforeEach",
    afterMethod: "after",
    afterAllMethod: "afterAll",
    afterEachMethod: "afterEach",
    itMethod: "it",
    xitMethod: "xit"
});

var specNames = function() {
    mod.thatMethod = mod.itMethod;
    mod.xthatMethod = mod.xitMethod;
    mod.setBeforeAllMethod = mod.beforeAllMethod;
    mod.setBeforeMethod = mod.beforeMethod;
    mod.setAfterAllMethod = mod.afterAllMethod;
    mod.setAfterMethod = mod.afterMethod;
};

exports.callMethod = function(name) {
    return global[mod[name+"Method"]];
};

exports.renameMethod = function(methods) {
    _.extend(mod,methods);
    specNames();
};