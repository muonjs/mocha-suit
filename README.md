# Mocha Suit - the way to improve your tests.

It's a simple wrapper for your Mocha tests to make them a bit more OOP like.

----

## Motivation ##

The main rule of any test you create is **TEST should be simple as much as posible**.
Unfortunately JavaScript which is my the most loved programing language is so elegant and simple that sometimes it's become a problem when you create something  more or less complicated.

To be honest all we know JS is object oriented language just partially. This is the reason why it's not so easy to create test framework on JavaScript so cool as for example jUnit in Java. In most cases it's ok to follow algorithmic approach with all these *describes*/*before*/*it*/*after* when you create some simple stuff. But basically it does not encourage you to reuse your code. And at some point you start to share your variables and methods between your *describes* in common closure or (ohh no!) in global object. Then you create your own wrappers upon test modules, move  helpers from neighboring modules and so on. And finally you reinvent the wheel and create your own test generation script. 

So I did. Almost did

## Installation ##

```sh
# from NPM
$ npm install --save-dev mocha-suit

# last version from GIT
$ git clone https://github.com/muonjs/mocha-suit.git
$ cd ../mocha-suit
$ sudo npm link .
$ cd ~/PathToYourSuperProject
$ npm link mocha-suit
```

## Description ##

Mocha Suit is the wrapper upon the [Mocha](http://mochajs.org/) test framework. It helps you to incapsulate your tests within the class object (named **Suit**) with it's own setup (`before` and `beforeEach`), teardown (`after` and `afterEach`) methods and testcases (`it`) themselves. Literally Suit is a `describe` block of Mocha with it's own testcases.

```js
var MochaSuit = require("mocha-suit");
var Suit = MochaSuit("Your first test suit");
Suit.before(function() { ... });
Suit.it("test it!",function() { ... });
Suit.after(function() { ... });
new Suit();
/* ----------- will generate ----------- */
describe("Your first test suit",function() {
    before(function() { ... });
    it("test it!",function() { ... });
    after(function() { ... });
});
```

Suit could be extended to new sub suit, that means you place another `describe` block inside of top one.

```js
var MochaSuit = require("mocha-suit");
var TopSuit = MochaSuit("Top test suit");
TopSuit.before(function() { ... });

var Suit = TopSuit.extend("Some specific suit");
Suit.before(function() { ... });
Suit.it("test it!",function() { ... });
Suit.after(function() { ... });
new Suit();
/* ----------- will generate ----------- */
describe("Top test suit",function() {
    before(function() { ... });
    describe("Some specific suit",function() {
        before(function() { ... });
        it("test it!",function() { ... });
        after(function() { ... });
    })
});
```
Mocha Suit is complient to Mocha. So `this` is always Mocha's `this` object which is accessible inside of all Mocha's setup and test methods when you run them in usual manner.  Also you can use `done` argument to call methods asyncronously (or return a Promise object).

```js
Suit.before(function(done) {
  this.timeout(3000);
  setTimeout(done,2000);
});

Suit.before(function() {
  return Promise.delay(2000);
});

/* ----------- will generate ----------- */
before(function(done) {
  this.timeout(3000);
  setTimeout(done,2000);
});

before(function() {
  return Promise.delay(2000);
});
```

Is that all? Nope. Welcome to the [wiki](https://github.com/muonjs/mocha-suit/wiki) for the rest cool stuff.

## Usage ##

Mocha Suit depends on Mocha. So you need to initialize Mocha before run your tests. Simplest way is to put your tests in `/test/` directory and then run `mocha` from console. Since Suit is just a wrapper you can utilize any mocha options and arguments you want. For more info visit Mocha's [documentation](https://github.com/mochajs/mocha/wiki).



## Documentation && Translation ##
Since English isn't my native language I'll appreciate any pull requests with REAME corrections as well as request with translations to any other languages.

## Test && Contribution ##
To run tests:
```bash
$ npm test
```
Since `Mocha` is dev dependency of MochaSuit this call envokes *mocha* under `./test/tests` directory with options passed to `./test/mocha.opts`. Alternative way to do the same thing is:
```bash
$ mocha -R spec # or whatever reporter you like
```

For Jasmine's fans there is `./spec/support/jasmine.conf` tuning Jasmine to run the same tests inside of alternative environment.
```bash
$ jasmine
```

All pull requests are welcomed.

## License ##
This project is distributed under [MIT license](https://github.com/muonjs/mocha-suit/blob/master/LICENSE). 2016.
