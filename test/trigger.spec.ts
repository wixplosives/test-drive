import {sinon, waitFor, expect, trigger} from "../src";

function createSpy(): sinon.SinonSpy {
    return sinon.spy();
}

describe('trigger', function () {
    let container: HTMLElement;

    beforeEach(function () {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(function () {
        container && container.parentNode && container.parentNode.removeChild(container);
    });

    describe('.change()', function () {
        ['input', 'textarea'].forEach(tagName => {
            it(`triggers "change" event for <${tagName}>`, function () {
                const onChange = createSpy();
                const onInput = createSpy();
                const onFocus = createSpy();

                const testInput = document.createElement(tagName);
                container.appendChild(testInput);
                testInput.addEventListener('change', onChange);
                testInput.addEventListener('input', onInput);
                testInput.addEventListener('focus', onFocus);

                trigger.change(testInput, 'Mr Monkey');

                return waitFor(() => {
                    expect(onChange).to.have.been.calledWithMatch({
                        type: 'change',
                        target: testInput
                    });
                    expect(onInput).to.have.been.calledWithMatch({
                        type: 'input',
                        target: testInput
                    });
                    expect(onFocus).to.have.been.calledWithMatch({
                        type: 'focus',
                        target: testInput
                    });
                    expect(testInput).to.have.property('value', 'Mr Monkey');
                });
            });
        });

        it('triggers "change" event for <select>', function () {
            const onChange = createSpy();
            const onFocus = createSpy();
            const testInput = document.createElement('select');
            testInput.innerHTML = `
                    <option value="funky"/>
                    <option value="monkey"/>
            `;
            container.appendChild(testInput);
            testInput.addEventListener('change', onChange);
            testInput.addEventListener('focus', onFocus);
            trigger.change(testInput, 'monkey');
            return waitFor(() => {
                expect(onChange).to.have.been.calledWithMatch({
                    type: 'change',
                    target: testInput
                });
                expect(onFocus).to.have.been.calledWithMatch({
                    type: 'focus',
                    target: testInput
                });
                expect(testInput).to.have.property('value', 'monkey');
            });
        });

        it('fails to trigger "change" event for <div>, etc.', function () {
            const onChange = sinon.spy();
            const onInput = sinon.spy();
            const onFocus = sinon.spy();
            const testNonInput = document.createElement('div');
            container.appendChild(testNonInput);
            testNonInput.addEventListener('change', onChange);
            testNonInput.addEventListener('input', onInput);
            testNonInput.addEventListener('focus', onFocus);

            expect(() => trigger.change(testNonInput, 'Mr Monkey')).to.throw('Trying to trigger "change" event on non-input element <DIV>');
            return new Promise(resolve => setTimeout(resolve, 10))
                .then(() => {
                    expect(onFocus).to.not.been.called;
                    expect(onChange).to.not.been.called;
                    expect(onInput).to.not.been.called;
                    expect(testNonInput).not.to.have.property('value');
                });
        });

        it('fails gracefully for null element (interoperability with select())', function () {
            expect(() => trigger.change(null, 'Mr Monkey')).to.throw('Trying to trigger "change" on "null" element.')
        });

    });
});
