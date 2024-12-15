// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../matchers.d.ts" preserve="true" />

import sinon from 'sinon';
import * as chai from 'chai';
import chaiDom from 'chai-dom';
import isPresent from './is-present.js';
import chaiAsPromised from 'chai-as-promised';
import chaiStyle from 'chai-style';
import sinonChai from 'sinon-chai';
import layout from './layout.js';

export * from 'promise-assist';

chai.use(layout);
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(isPresent);
if (typeof window !== 'undefined') {
    // chai-dom's matchers are not Node-safe
    chai.use(chaiDom);
    chai.use(chaiStyle);
}

const expect: Chai.ExpectStatic = Object.assign(chai.expect.bind(chai), chai.expect);

export * from './helpers.js';
export * from './layout.js';
export * from './layout-driver.js';
export * from './select-dom.js';

export { chai, sinon, expect, layout };
