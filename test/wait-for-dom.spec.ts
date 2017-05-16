import { waitForDom, sinon, expect } from '../src';
import Promise = require('bluebird');

describe('waitForDom()', function () {
    let container: Element;
    beforeEach(function () {
        container = document.createElement('div');
        container.setAttribute('data-test-attr', '666');
        document.body.appendChild(container);
    });

    afterEach(function () {
        document.body.removeChild(container);
    });

    it('passes when the state is already as expected', function () {
        const assert = sinon.spy(function (dom: Element) {
            expect(dom.querySelector('[data-test-attr="666"]')).not.to.be.null;
        });
        const promise = waitForDom(document.body, assert);
        expect(assert).to.have.been.called;
        return promise;
    });

    it('passes only after the assertion passes with the expected value', function () {
        setTimeout(function () {
            container.setAttribute('data-test-attr', '000');
        }, 25);

        const assert = function (dom: Element) {
            expect(dom.querySelector('[data-test-attr="000"]')).not.to.be.null;
        };
        return waitForDom(document.body, assert, 50);
    });

    it('fails when the timeout is reached', function () {
        const assert = function (dom: Element) {
            expect(dom.querySelector('[data-test-attr="000"]'), 'Requested element not found').not.to.be.null;
        };
        return expect(waitForDom(document.body, assert, 50)).to.be.rejectedWith('Requested element not found: expected null not to be null');
    });

    it('fails when the timeout is reached even if dom updates', function () {
        const assert = function (dom: Element) {
            expect(dom.querySelector('[data-test-attr="000"]'), 'Requested element not found').not.to.be.null;
        };

        setTimeout(() => container.setAttribute('data-test-attribute', '123'), 0);

        return expect(waitForDom(document.body, assert, 50)).to.be.rejectedWith('Requested element not found: expected null not to be null');
    });

    it('fails when the assertion function returns a Promise', function () {
        const assertion = function () {
            return new Promise(() => {});
        };

        return expect(waitForDom(document.body, assertion)).to.be.rejectedWith('Promises shouldn\'t be returned from within waitFor/waitForDom! Please refer to the docs for a more detailed explanation of usage');
    });
});
