import { selectDom, expect } from '../index.js';

function textContent(element: Element | null) {
    return element && element.textContent;
}

describe('selectDom', function () {
    let container: HTMLElement;

    beforeEach(function () {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(function () {
        document.body.removeChild(container);
    });

    it('selects simple dom by data-automation-id', function () {
        const select = selectDom(container);
        container.innerHTML = `
        <div>
            <p data-automation-id="test-id">It is here.</p>
            <p data-automation-id="other-id">Not here.</p>
        </div>`;
        expect(textContent(select('test-id'))).to.equal('It is here.');
        expect(textContent(select('other-id'))).to.equal('Not here.');
    });

    it('selects simple dom by data-template-id', function () {
        const select = selectDom(container, 'data-template-id');
        container.innerHTML = `
        <div>
            <p data-template-id="test-id">It is here.</p>
            <p data-template-id="other-id">Not here.</p>
        </div>`;
        expect(textContent(select('test-id'))).to.equal('It is here.');
        expect(textContent(select('other-id'))).to.equal('Not here.');
    });

    it('returns null when no element found', function () {
        const select = selectDom(container);
        container.innerHTML = `
        <div>
            <p data-automation-id="test-id">It is here.</p>
            <p data-automation-id="other-id">Not here.</p>
        </div>`;
        expect(select('no-such-thing')).to.equal(null);
    });

    it('selects nested components (unambiguous path)', function () {
        const select = selectDom(container);
        container.innerHTML = `
            <div>
                <div data-automation-id="level1">
                    <p data-automation-id="other-id">Not here.</p>
                    <p data-automation-id="level2">It is here.</p>
                </div>

            </div>`;
        expect(textContent(select('level1', 'level2'))).to.equal('It is here.');
    });

    it('selects nested components (two ids on the same element)', function () {
        const select = selectDom(container);
        container.innerHTML = `
            <div>
                <div data-automation-id="level1">
                    <p data-automation-id="other-id">Not here.</p>
                    <p data-automation-id="level2 level3">It is here.</p>
                </div>

            </div>`;
        expect(textContent(select('level1', 'level2', 'level3'))).to.equal('It is here.');
    });

    it('fails when encountering ambiguity in nested paths (1)', function () {
        const select = selectDom(container);
        container.innerHTML = `
            <div>
                <div data-automation-id="level1">
                    <p data-automation-id="level2">It is here.</p>
                </div>
                <div data-automation-id="level1">
                </div>

            </div>`;
        expect(() => select('level1', 'level2')).to.throw('Selector "level1" ambiguous (2 matches)');
    });

    it('fails when encountering ambiguity in nested paths (2)', function () {
        const select = selectDom(container);
        container.innerHTML = `
            <div>
                <div data-automation-id="level1">
                    <p data-automation-id="level2">It is not here.</p>
                    <div data-automation-id="level2">Neither here.</div>
                </div>


            </div>`;
        expect(() => select('level1', 'level2')).to.throw('Selector "level2" ambiguous (2 matches)');
    });

    it('returns null if some part of nested path is missing', function () {
        const select = selectDom(container);
        container.innerHTML = `
        <div>
            <p data-automation-id="test-id">It is here.</p>
            <p data-automation-id="other-id">Not here.</p>
        </div>`;
        expect(select('no-such-thing', 'test-id')).to.equal(null);
    });
});
