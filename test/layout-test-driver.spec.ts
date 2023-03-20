import { expect, generateMap, dom, type Geometry } from '../src';

describe('Layout test driver', function () {
    const source = `
        a----------a
        |          |   b----b
        |          |   |    |     c---------c
        |          |   b----b     |         |
        |          |              c---------c
        |          |
        a----------a
`;

    it('generates geometry map from source', function () {
        expect(generateMap(source)).to.eql({
            a: [9, 1, 12, 7],
            b: [24, 2, 6, 3],
            c: [35, 3, 11, 3],
        });
    });

    function assertElement(element: HTMLElement, id: string, geometry: Geometry) {
        const style = getComputedStyle(element);
        expect(element).to.have.id(id);
        expect(style.position).to.equal('absolute');
        expect(style.left).to.equal(`${geometry[0]}px`);
        expect(style.top).to.equal(`${geometry[1]}px`);
        expect(style.width).to.equal(`${geometry[2]}px`);
        expect(style.height).to.equal(`${geometry[3]}px`);
    }

    it('generates DOM from geometry map', function () {
        const map = dom(source);
        document.body.appendChild(map.container);
        const { a, b, c } = map;
        assertElement(a, 'a', [9, 1, 12, 7]);
        assertElement(b, 'b', [24, 2, 6, 3]);
        assertElement(c, 'c', [35, 3, 11, 3]);
    });
});
