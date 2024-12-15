/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import { expect, getLayoutFixture, detectMisalignment } from '../index.js';

describe('Layout matchers', function () {
    describe('detect placement', function () {
        it('with .insideOf() and .outsideOf()', function () {
            const { a, b, c, x } = getLayoutFixture(`

        x--------------------x
        |                    |      c--c
        |   a-----a          |      |  |
        |   |     |       b--|--b   c--c
        |   |     |       |  |  |
        |   a-----a       |  |  |
        |                 b--|--b
        |                    |
        |                    |
        x--------------------x
`);

            expect(a).to.be.insideOf(x);
            expect(a).not.to.be.outsideOf(x);
            expect(() => expect(a).to.be.outsideOf(x)).to.throw(
                "Expected element to be outside of the other, but it wasn't.",
            );
            expect(() => expect(a).not.to.be.insideOf(x)).to.throw(
                'Expected element not to be inside of the other, but it was.',
            );

            expect(b).not.to.be.insideOf(x);
            expect(b).not.to.be.outsideOf(x);

            expect(c).to.be.outsideOf(x);
            expect(c).not.to.be.insideOf(x);
            expect(() => expect(c).to.be.insideOf(x)).to.throw(
                "Expected element to be inside of the other, but it wasn't.",
            );
            expect(() => expect(c).not.to.be.outsideOf(x)).to.throw(
                'Expected element not to be outside of the other, but it was.',
            );
        });
    });

    describe('measure box properties', function () {
        let a: Element, b: Element, c: Element;
        before(function () {
            ({ a, b, c } = getLayoutFixture(`

                           b----b      c---------c
                           |    |      |         |
                           |    |      |         |
                           |    |      |         |
        a-------------a    |    |      |         |
        |             |    |    |      |         |
        a-------------a    b----b      c---------c
`));
        });

        function assertBoxProp(element: Element, propName: string, correctValue: number, incorrectValue: number) {
            (expect(element).to.have as any)[propName].equal(correctValue);
            (expect(element).not.to.have as any)[propName].equal(incorrectValue);
            expect(() => (expect(element).to.have as any)[propName].equal(incorrectValue)).to.throw(
                `expected ${correctValue} to equal ${incorrectValue}`,
            );
            expect(() => (expect(element).not.to.have as any)[propName].equal(correctValue)).to.throw(
                `expected ${correctValue} to not equal ${correctValue}`,
            );
        }

        it('asserting width', function () {
            assertBoxProp(a, 'width', 15, 14);
        });

        it('asserting height', function () {
            assertBoxProp(a, 'height', 3, 4);
        });

        it('asserting left', function () {
            assertBoxProp(a, 'left', 9, 15);
        });

        it('asserting right', function () {
            assertBoxProp(a, 'right', 24, 30);
        });

        it('asserting top', function () {
            assertBoxProp(b, 'top', 2, 10);
        });

        it('asserting bottom', function () {
            assertBoxProp(b, 'bottom', 9, 10);
        });

        it('comparing them', function () {
            expect(a).to.have.width.greaterThan(10);
            expect(a).to.have.width.greaterThan(b);
            expect(a).not.to.have.width.lessThan(b);
            expect(a).to.have.height.lessThan(5);
            expect(a).not.to.have.height.greaterThan(5);
            expect(() => expect(a).to.have.height.greaterThan(5)).to.throw(`expected 3 to be above 5`);
            expect(a).to.have.height.lessThan(b);
            expect(b).to.have.height.at.least(7);
            expect(() => expect(b).not.to.have.height.at.least(7)).to.throw(`expected 7 to be below 7`);
            expect(b).to.have.height.at.least(c);
            expect(b).to.have.height.at.most(c);
            expect(b).to.be.with.left.above(a);
            expect(() => expect(b).to.be.with.left.above(700)).to.throw(`expected 28 to be above 700`);
            expect(b).to.be.with.right.below(c);
        });
    });

    describe('detects alignment', function () {
        describe('detectMisalignment() returns indices of misaligned items', function () {
            it('for integer edges (some misaligned)', function () {
                expect(detectMisalignment([5, 5, 7, 5, 2])).to.eql([2, 4]);
            });

            it('integer edges (all aligned)', function () {
                expect(detectMisalignment([5, 5, 5, 5, 5])).to.eql([]);
            });

            it('integer edges (all wildly dispersed, the 1st one considered baseline', function () {
                expect(detectMisalignment([5, 7, 3, 1, 4])).to.eql([1, 2, 3, 4]);
            });

            it('real edges (some misaligned)', function () {
                expect(detectMisalignment([5.2, 5.2, 7.3, 5.2, 2.4])).to.eql([2, 4]);
            });

            it('real edges with tolerance value (some misaligned)', function () {
                expect(detectMisalignment([5.2, 4.9, 7.3, 5.4, 2.4], 0.5)).to.eql([2, 4]);
            });
        });

        it('will throw an error when input list of elements is of length zero or one', () => {
            const { a } = getLayoutFixture(`
                a---a
                |   |
                |   |
                |   |
                a---a
            `);

            const verticalAlignments: VerticalAlignment[] = ['top', 'bottom', 'center'];
            const horizontalAlignments: HorizontalAlignment[] = ['left', 'right', 'center'];

            verticalAlignments.forEach((alignment) => {
                expect(() => expect([]).to.be.verticallyAligned(alignment)).to.throw(
                    `Expected elements to be vertically aligned to "${alignment}" but element list was empty`,
                );
                expect(() => expect([a]).to.be.verticallyAligned(alignment)).to.throw(
                    `Expected elements to be vertically aligned to "${alignment}" but element list had only one element`,
                );
            });

            horizontalAlignments.forEach((alignment) => {
                expect(() => expect([]).to.be.horizontallyAligned(alignment)).to.throw(
                    `Expected elements to be horizontally aligned to "${alignment}" but element list was empty`,
                );
                expect(() => expect([a]).to.be.horizontallyAligned(alignment)).to.throw(
                    `Expected elements to be horizontally aligned to "${alignment}" but element list had only one element`,
                );
            });
        });

        it('(vertical top)', function () {
            const { a, b, c, d } = getLayoutFixture(`

            ----a---a------b---b------d----d---------
                |   |      |   |      |    |
                |   |      b---b c--c |    |
                |   |            |  | d----d
                a---a            |  |
                                 c--c
`);
            expect([a, b, d]).to.be.verticallyAligned('top');
            expect([a, b, c, d]).not.to.be.verticallyAligned('top');
            expect([a, b, c, d]).to.be.verticallyAligned('top', 2.0);

            expect(() => expect([a, b, c, d]).to.be.verticallyAligned('top')).to.throw(
                'Expected elements to be vertically aligned to "top" but some weren\'t. ([2])',
            );
            expect(() => expect([a, b, d]).not.to.be.verticallyAligned('top')).to.throw(
                'Expected elements not to be vertically aligned to "top" but they were.',
            );
        });

        it('(vertical center)', function () {
            const { a, b, c, d } = getLayoutFixture(`

                a---a             c--c
                |   |             |  |d----d
                |   |      b---b  c--c|    |
            ----|   |------|   |------|    |---------
                |   |      b---b      |    |
                |   |                 d----d
                a---a

`);
            expect([a, b, d]).to.be.verticallyAligned('center');
            expect([a, b, c, d]).not.to.be.verticallyAligned('center');
            expect([a, b, c, d]).to.be.verticallyAligned('center', 2.0);

            expect(() => expect([a, b, c, d]).to.be.verticallyAligned('center')).to.throw(
                'Expected elements to be vertically aligned to "center" but some weren\'t. ([2])',
            );
            expect(() => expect([a, b, d]).not.to.be.verticallyAligned('center')).to.throw(
                'Expected elements not to be vertically aligned to "center" but they were.',
            );
        });

        it('(vertical bottom)', function () {
            const { a, b, c, d } = getLayoutFixture(`
                                      d----d
                a---a             c--c|    |
                |   |      b---b  |  ||    |
                |   |      |   |  c--c|    |
            ----a---a------b---b------d----d---------

`);
            expect([a, b, d]).to.be.verticallyAligned('bottom');
            expect([a, b, c, d]).not.to.be.verticallyAligned('bottom');
            expect([a, b, c, d]).to.be.verticallyAligned('bottom', 1.0);

            expect(() => expect([a, b, c, d]).to.be.verticallyAligned('bottom')).to.throw(
                'Expected elements to be vertically aligned to "bottom" but some weren\'t. ([2])',
            );
            expect(() => expect([a, b, d]).not.to.be.verticallyAligned('bottom')).to.throw(
                'Expected elements not to be vertically aligned to "bottom" but they were.',
            );
        });

        it('(horizontal left)', function () {
            const { a, b, c, d } = getLayoutFixture(`

            |
            a---------a
            |         |
            a---------a
            |
            b-----b
            b-----b
            |
            |   c----------c
            |   |          |
            |   c----------c
            d----d
            d----d
            |
            |

`);
            expect([a, b, d]).to.be.horizontallyAligned('left');
            expect([a, b, c, d]).not.to.be.horizontallyAligned('left');
            expect([a, b, c, d]).to.be.horizontallyAligned('left', 4.0);

            expect(() => expect([a, b, c, d]).to.be.horizontallyAligned('left')).to.throw(
                'Expected elements to be horizontally aligned to "left" but some weren\'t. ([2])',
            );
            expect(() => expect([a, b, d]).not.to.be.horizontallyAligned('left')).to.throw(
                'Expected elements not to be horizontally aligned to "left" but they were.',
            );
        });

        it('(horizontal center)', function () {
            const { a, b, c, d } = getLayoutFixture(`

                 |
            a---------a
            |         |
            a---------a
                 |
              b-----b
              b-----b
                 |
                c----------c
                |          |
                c----------c
             d-------d
             d-------d
                 |
                 |

`);
            expect([a, b, d]).to.be.horizontallyAligned('center');
            expect([a, b, c, d]).not.to.be.horizontallyAligned('center');
            expect([a, b, c, d]).to.be.horizontallyAligned('center', 5.0);

            expect(() => expect([a, b, c, d]).to.be.horizontallyAligned('center')).to.throw(
                'Expected elements to be horizontally aligned to "center" but some weren\'t. ([2])',
            );
            expect(() => expect([a, b, d]).not.to.be.horizontallyAligned('center')).to.throw(
                'Expected elements not to be horizontally aligned to "center" but they were.',
            );
        });

        it('(horizontal right)', function () {
            const { a, b, c, d } = getLayoutFixture(`

                                  |
                        a---------a
                        |         |
                        a---------a
                                  |
                            b-----b
                            b-----b
                                  |
                c----------c      |
                |          |      |
                c----------c      |
                             d----d
                             d----d
                                  |
                                  |

`);
            expect([a, b, d]).to.be.horizontallyAligned('right');
            expect([a, b, c, d]).not.to.be.horizontallyAligned('right');
            expect([a, b, c, d]).to.be.horizontallyAligned('right', 7.0);

            expect(() => expect([a, b, c, d]).to.be.horizontallyAligned('right')).to.throw(
                'Expected elements to be horizontally aligned to "right" but some weren\'t. ([2])',
            );
            expect(() => expect([a, b, d]).not.to.be.horizontallyAligned('right')).to.throw(
                'Expected elements not to be horizontally aligned to "right" but they were.',
            );
        });
    });

    describe('Detect sequence of elements', function () {
        it('horizontally', function () {
            const { a, b, c, d } = getLayoutFixture(`
                   b--b                d----d
            a----a |  |                |    |
            |    | b--bc-----------c   |    |
            |    |     |           |   d----d
            a----a     c-----------c
`);

            expect([a, b, c]).to.be.inHorizontalSequence();
            expect([a, b, c, d]).not.to.be.inHorizontalSequence();
            expect([a, b, c, d]).to.be.inHorizontalSequence({ tolerance: 4.0 });

            expect(() => expect([a, b, c, d]).to.be.inHorizontalSequence()).to.throw(
                "Expected elements to form horizontal sequence, but they didn't. (3)",
            );
            expect(() => expect([a, b, c]).not.to.be.inHorizontalSequence()).to.throw(
                'Expected elements not to form horizontal sequence, but they did.',
            );

            expect(() => expect([]).to.be.inHorizontalSequence()).to.throw(
                'Expected elements to form horizontal sequence, but element list was empty',
            );
        });

        it('vertically', function () {
            const { a, b, c, d } = getLayoutFixture(`

                     a-------a
                     |       |
                     |       |
                     a-------a
                b------b
                |      |
                b------b
                       c-------------c
                       |             |
                       |             |
                       |             |
                       c-------------c


                 d---------d
                 |         |
                 d---------d
`);

            expect([a, b, c]).to.be.inVerticalSequence();
            expect([a, b, c, d]).not.to.be.inVerticalSequence();
            expect([a, b, c, d]).to.be.inVerticalSequence({ tolerance: 4.0 });

            expect(() => expect([a, b, c, d]).to.be.inVerticalSequence()).to.throw(
                "Expected elements to form vertical sequence, but they didn't. (3)",
            );
            expect(() => expect([a, b, c]).not.to.be.inVerticalSequence()).to.throw(
                'Expected elements not to form vertical sequence, but they did.',
            );

            expect(() => expect([]).to.be.inVerticalSequence()).to.throw(
                'Expected elements to form vertical sequence, but element list was empty',
            );
        });

        it('with specified distance between horizontal elements', function () {
            const { a, b, c, d } = getLayoutFixture(`
                     b--b                    d----d
            a----a   |  |                    |    |
            |    |   b--b   c-----------c    |    |
            |    |          |           |    d----d
            a----a          c-----------c
`);
            expect([a, b, c]).to.be.inHorizontalSequence({ tolerance: 0, distance: 3 });
            expect([a, b, c, d]).to.not.be.inHorizontalSequence({ tolerance: 0, distance: 2 });
            expect([a, b, c]).to.not.be.inHorizontalSequence({ tolerance: 0, distance: 1 });
            expect([a, b, c, d]).to.be.inHorizontalSequence({ tolerance: 2, distance: 2 });
        });

        it('with specified distance between vertical elements', function () {
            const { a, b, c, d } = getLayoutFixture(`

                     a-------a
                     |       |
                     |       |
                     a-------a

                b------b
                |      |
                b------b

                 c-------------c
                 |             |
                 |             |
                 |             |
                 c-------------c


                 d---------d
                 |         |
                 d---------d
`);
            expect([a, b, c]).to.be.inVerticalSequence({ tolerance: 0, distance: 1 });
            expect([a, b, c, d]).to.not.be.inVerticalSequence({ tolerance: 0, distance: 3 });
            expect([a, b, c, d]).to.not.be.inVerticalSequence({ tolerance: 0, distance: 1 });
            expect([a, b, c, d]).to.be.inVerticalSequence({ tolerance: 1, distance: 1 });
        });
    });
});
