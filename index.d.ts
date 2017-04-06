// Type definitions for mocha-suit@0.5.1
// Project: Mocha Suit
// Definitions by: Sukharev Kirill <SukharevKirill@gmail.com>

import * as Promise from "@types/bluebird";

declare type Suit = { [key:string]: any } & { [key:number]: any };
declare type TestSet = { testSet: boolean; } & { [key:string]: Suit; }

declare interface ExtendMethod {
    (description: string, ctx: Suit, cb?: (this: MochaSuitFactory) => void): MochaSuitFactory
    (description: string, cb?: (this: MochaSuitFactory) => void): MochaSuitFactory
}

declare interface CallBack {
    (this: MochaSuitFactory, done?: (err?: any) => void): Promise<void> | void;
}

declare interface SetupMethod {
    (cb: CallBack): MochaSuitFactory;
    (suit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface TeardownMethod {
    (cb: CallBack) : MochaSuitFactory;
    (suit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface TestMethod {
    (caseDescription: string, cb: CallBack) : MochaSuitFactory;
    (suit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface WithMethod {
    (suit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface ReplaceMethod {
    (oldSuit: MochaSuitFactory, newSuit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface SetMethod {
    (suit: MochaSuitFactory, cb: CallBack) : MochaSuitFactory;
}

declare class MochaSuitFactory {
    constructor()
    suit: Suit
}

declare interface MochaSuitFactory {
    (): void;
    (testSet: TestSet): void;
    (suits: Suit[]): void;
    (suit: Suit): void;
    extend: ExtendMethod;
    before: SetupMethod;
    beforeAll: SetupMethod;
    beforeEach: SetupMethod;
    after: TeardownMethod;
    afterAll: TeardownMethod;
    afterEach: TeardownMethod;
    it: TestMethod;
    xit: TestMethod;
    that: TestMethod;
    xthat: TestMethod;
    with: WithMethod;
    replaceWith: ReplaceMethod;
    setBefore: SetMethod;
    setAfter: SetMethod;
    setBeforeAll: SetMethod;
    setAfterAll: SetMethod;
}


declare function MochaSuitModule(name?: string): MochaSuitFactory;

export = MochaSuitModule;