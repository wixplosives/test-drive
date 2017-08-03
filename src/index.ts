/// <reference path="../matchers.d.ts" />

import sinon = require('sinon');
import chai = require('chai');
import chaiDom = require('chai-dom');
import isPresent from './is-present';
import chaiAsPromised = require('chai-as-promised-compat');
import sinonChai = require('sinon-chai');
import chaiStyle = require('chai-style');
import layout from './layout';
chai.use(layout);
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(isPresent);
if (typeof window !== 'undefined') { // chai-dom's matchers are not Node-safe
    chai.use(chaiDom);
    chai.use(chaiStyle);
}

const expect = Object.assign(chai.expect.bind(chai), chai.expect) as Chai.ExpectStatic;

export * from './select-dom';
export * from './wait-for';
export { chai, sinon, expect, layout };
export * from './trigger';
