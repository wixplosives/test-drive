/// <reference path="../matchers.d.ts" />

import sinon from 'sinon';
import chai from 'chai';
import chaiDom from 'chai-dom';
import isPresent from './is-present';
import chaiAsPromised from 'chai-as-promised';
import chaiStyle from 'chai-style';
import sinonChai from 'sinon-chai';
import layout from './layout';

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

export * from './helpers';
export * from './layout';
export * from './layout-driver';
export * from './select-dom';

export { chai, sinon, expect, layout };
