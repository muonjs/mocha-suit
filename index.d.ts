// Type definitions for mocha-suit@0.5.1
// Project: Mocha Suit
// Definitions by: Sukharev Kirill <SukharevKirill@gmail.com>

declare type Suit = { [key:string]: any } & { [key:number]: any };
declare type TestSet = { testSet: boolean } & { [key:string]: Suit }

declare interface DoneMethod {
    (err?: any): void
}

declare interface ExtendMethod {
    (this: MochaSuitFactory, description: string, ctx: Suit, cb?: (this: MochaSuitFactory) => void): MochaSuitFactory
    (this: MochaSuitFactory, description: string, cb?: (this: MochaSuitFactory) => void): MochaSuitFactory
}

declare interface CallBack {
    (this: MochaSuitFactory, done?: DoneMethod): Promise<void> | void;
}

declare interface SetupMethod {
    (this: MochaSuitFactory, description: string, cb: CallBack): MochaSuitFactory;
    (this: MochaSuitFactory, cb: CallBack): MochaSuitFactory;
    (this: MochaSuitFactory, suit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface TeardownMethod {
    (this: MochaSuitFactory, description: string, cb: CallBack): MochaSuitFactory;
    (this: MochaSuitFactory, cb: CallBack) : MochaSuitFactory;
    (this: MochaSuitFactory, suit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface TestMethod {
    (this: MochaSuitFactory, description: string, cb?: CallBack) : MochaSuitFactory;
    (this: MochaSuitFactory, suit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface WithMethod {
    (this: MochaSuitFactory, suit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface ReplaceMethod {
    (this: MochaSuitFactory, oldSuit: MochaSuitFactory, newSuit: MochaSuitFactory) : MochaSuitFactory;
}

declare interface SetMethod {
    (this: MochaSuitFactory, suit: MochaSuitFactory, newSuit: MochaSuitFactory) : MochaSuitFactory;
}

declare class MochaSuitFactory {
    constructor();
    suit: Suit;
    // Attribute list of mocha context (based on mocha@8.1.2)
    currentTest: any;
    _runnable: any;
    test: any;
    runnable: (any) => MochaSuitFactory;
    timeout: (ms: number) => void;
    enableTimeouts: (enabled: boolean) => void;
    slow: (ms: number) => void;
    skip: () => void;
    inspect: () => string;
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
    insertAbove: SetMethod;
    insertBelow: SetMethod;
    [key:string]: MochaSuitFactory | Function | Suit
}


declare function MochaSuitModule(name?: string): MochaSuitFactory;
declare function MochaSuitModule(name?: string, context?: any): MochaSuitFactory;
declare function MochaSuitModule(context?: any): MochaSuitFactory;

export = MochaSuitModule;
