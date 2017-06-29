import { waitFor, expect, sinon } from '../src';

describe('waitFor()', function () {
    it('passes when the state is already as expected', function () {
        const state = 666;
        const assertion = sinon.spy(function () {
            expect(state).to.equal(666);
        });
        waitFor(assertion, 50);
        expect(assertion).to.have.been.called;
    });

    it('passes only after the assertion passes with the expected value', function () {
        let state = 0;
        const assertion = function () {
            expect(state).to.equal(666);
        };
        setTimeout(function () {
            state = 666;
        }, 25);
        return waitFor(assertion, 50);
    });

    it('fails when the timeout is reached', function () {
        let state = 0;
        const assertion = function () {
            expect(state).to.equal(666);
        };
        setTimeout(function () {
            state = 666;
        }, 150);
        return expect(waitFor(assertion, 50)).to.be.rejectedWith(Error, 'expected 0 to equal 666');
    });

    it('fails when the assertion function returns a Promise', function () {
        const assertion = function () {
            return new Promise(() => { });
        };

        return expect(waitFor(assertion, 50)).to.be.rejectedWith('Promises shouldn\'t be returned from within waitFor/waitForDom! Please refer to the docs for a more detailed explanation of usage');
    });
});
