import { isElement } from './helpers.js';

interface Point {
    x: number;
    y: number;
}

type VerticalAlignment = 'top' | 'center' | 'bottom';
type HorizontalAlignment = 'left' | 'center' | 'right';

type Direction = 'vertical' | 'horizontal';

export function getBoundaries(element: Element): DOMRect {
    return element.getBoundingClientRect();
}

function isPointInside(pt: Point, boundaries: DOMRect): boolean {
    return pt.x >= boundaries.left && pt.x <= boundaries.right && pt.y >= boundaries.top && pt.y <= boundaries.bottom;
}

function isInside(rect: DOMRect, boundaries: DOMRect): boolean {
    return (
        rect.left >= boundaries.left &&
        rect.top >= boundaries.top &&
        rect.right <= boundaries.right &&
        rect.bottom <= boundaries.bottom
    );
}

function isOutside(rect: DOMRect, boundaries: DOMRect): boolean {
    return !(
        isPointInside({ x: rect.left, y: rect.top }, boundaries) ||
        isPointInside({ x: rect.left, y: rect.bottom }, boundaries) ||
        isPointInside({ x: rect.right, y: rect.top }, boundaries) ||
        isPointInside({ x: rect.right, y: rect.bottom }, boundaries)
    );
}

interface EdgeMapItem {
    range: [number, number];
    excludedEdges: number[];
}

function findExcludedEdges(edges: number[], range: [number, number]): number[] {
    return edges.reduce<number[]>(
        (acc, edge, index) => (edge >= range[0] && edge <= range[1] ? acc : acc.concat(index)),
        [],
    );
}

function getEdgeMap(edges: number[], tolerance: number): EdgeMapItem[] {
    return edges.reduce<EdgeMapItem[]>(
        (acc, edge) =>
            acc.concat(
                { range: [edge, edge + tolerance], excludedEdges: findExcludedEdges(edges, [edge, edge + tolerance]) },
                { range: [edge, edge - tolerance], excludedEdges: findExcludedEdges(edges, [edge, edge - tolerance]) },
            ),
        [],
    );
}

function pickLeastExcludedEdges(edgeMap: EdgeMapItem[]): number[] {
    const excludedEdgeItem = edgeMap.reduce<EdgeMapItem | null>(
        (acc, item) => (!acc || item.excludedEdges.length < acc.excludedEdges.length ? item : acc),
        null,
    );
    if (excludedEdgeItem) {
        return excludedEdgeItem.excludedEdges;
    } else {
        return [];
    }
}

export function detectMisalignment(edges: number[], tolerance = 0): number[] {
    const edgeMap = getEdgeMap(edges, tolerance);
    return pickLeastExcludedEdges(edgeMap);
}

const propsByDirection = {
    horizontal: ['right', 'left'] as const,
    vertical: ['bottom', 'top'] as const,
};

type EdgeAccessor = (rect: DOMRect) => number;

function getEdgeAccessors(direction: Direction): [EdgeAccessor, EdgeAccessor] {
    const [prop1, prop2] = propsByDirection[direction];
    return [(rect) => rect[prop1], (rect) => rect[prop2]];
}

function findLastElementOfSequence(elements: Element[], direction: Direction, tolerance = 1, distance = 0): number {
    const [farEdge, nearEdge] = getEdgeAccessors(direction);
    const boundList = elements.map(getBoundaries);
    for (let i = 0; i < boundList.length - 1; i++) {
        const distanceBetweenElements = nearEdge(boundList[i + 1]) - farEdge(boundList[i]);
        if (Math.abs(distanceBetweenElements - distance) > tolerance) {
            return i + 1;
        }
    }
    return elements.length;
}

export default function use(chai: Chai.ChaiStatic, util: Chai.ChaiUtils): void {
    chai.Assertion.addMethod('insideOf', function (boundaryElement: Element) {
        const element = util.flag(this, 'object') as Element;
        this.assert(
            isInside(getBoundaries(element), getBoundaries(boundaryElement)),
            "Expected element to be inside of the other, but it wasn't.",
            'Expected element not to be inside of the other, but it was.',
            true,
        );
    });

    chai.Assertion.addMethod('outsideOf', function (boundaryElement: Element) {
        const element = util.flag(this, 'object') as Element;
        this.assert(
            isOutside(getBoundaries(element), getBoundaries(boundaryElement)),
            "Expected element to be outside of the other, but it wasn't.",
            'Expected element not to be outside of the other, but it was.',
            true,
        );
    });

    chai.Assertion.addMethod('widerThan', function (comparedTo: Element) {
        const element = util.flag(this, 'object') as Element;
        this.assert(
            getBoundaries(element).width > getBoundaries(comparedTo).width,
            "Expected element to be wider than the other, but it wasn't.",
            'Expected element not to be wider than the other, but it was.',
            true,
        );
    });

    chai.Assertion.addMethod('higherThan', function (comparedTo: Element) {
        const element = util.flag(this, 'object') as Element;
        this.assert(
            getBoundaries(element).height > getBoundaries(comparedTo).height,
            "Expected element to be higher than the other, but it wasn't.",
            'Expected element not to be higher than the other, but it was.',
            true,
        );
    });

    chai.Assertion.addMethod('biggerThan', function (comparedTo: Element) {
        const element = util.flag(this, 'object') as Element;
        const elementRect: ClientRect = getBoundaries(element);
        const comparedRect: ClientRect = getBoundaries(comparedTo);
        this.assert(
            elementRect.width * elementRect.height > comparedRect.width * comparedRect.height,
            "Expected element to be bigger than the other, but it wasn't.",
            'Expected element not to be bigger than the other, but it was.',
            true,
        );
    });

    function assertAlignment(
        this: Chai.AssertionStatic,
        direction: Direction,
        alignment: VerticalAlignment | HorizontalAlignment,
        tolerance: number,
    ) {
        const elementList = util.flag(this, 'object') as Element[];

        if (elementList.length === 0) {
            throw new Error(
                `Expected elements to be ${direction}ly aligned to "${alignment}" but element list was empty`,
            );
        } else if (elementList.length === 1) {
            throw new Error(
                `Expected elements to be ${direction}ly aligned to "${alignment}" but element list had only one element`,
            );
        }

        const edges: number[] =
            alignment === 'center'
                ? elementList.map((element) => {
                      const rect = getBoundaries(element);
                      if (direction === 'horizontal') {
                          return (rect.left + rect.right) / 2.0;
                      } else {
                          return (rect.top + rect.bottom) / 2.0;
                      }
                  })
                : elementList.map((element) => getBoundaries(element)[alignment]);
        const misaligned = detectMisalignment(edges, tolerance);
        this.assert(
            misaligned.length === 0,
            `Expected elements to be ${direction}ly aligned to "${alignment}" but some weren't. ([${misaligned.join(
                ', ',
            )}])`,
            `Expected elements not to be ${direction}ly aligned to "${alignment}" but they were.`,
            0,
            misaligned.length,
        );
    }

    chai.Assertion.addMethod('verticallyAligned', function (alignment: VerticalAlignment, tolerance = 0) {
        assertAlignment.call(this, 'vertical', alignment, tolerance as number);
    });

    chai.Assertion.addMethod(
        'horizontallyAligned',
        function (this: Chai.AssertionStatic, alignment: HorizontalAlignment, tolerance = 0) {
            assertAlignment.call(this, 'horizontal', alignment, tolerance as number);
        },
    );

    function assertSequence(
        this: Chai.AssertionStatic,
        direction: Direction,
        tolerance?: number,
        distanceBetween?: number,
    ) {
        const elementList = util.flag(this, 'object') as Element[];

        if (elementList.length === 0) {
            throw new Error(`Expected elements to form ${direction} sequence, but element list was empty`);
        } else if (elementList.length === 1) {
            throw new Error(`Expected elements to form ${direction} sequence, but element list had only one element`);
        }

        const lastElementOfSequence = findLastElementOfSequence(elementList, direction, tolerance, distanceBetween);
        this.assert(
            lastElementOfSequence === elementList.length,
            `Expected elements to form ${direction} sequence, but they didn't. (${lastElementOfSequence})`,
            `Expected elements not to form ${direction} sequence, but they did.`,
            elementList.length,
            lastElementOfSequence,
        );
    }

    chai.Assertion.addMethod('inHorizontalSequence', function (options: Options = {}) {
        assertSequence.call(this, 'horizontal', options.tolerance, options.distance);
    });

    chai.Assertion.addMethod('inVerticalSequence', function (options: Options = {}) {
        assertSequence.call(this, 'vertical', options.tolerance, options.distance);
    });

    chai.Assertion.addProperty('width', function () {
        const element = util.flag(this, 'object') as Element;
        const size = getBoundaries(element).width;
        util.flag(this, 'object', size);
        util.flag(this, 'layout', 'width');
    });

    function layoutProperty(propName: keyof ClientRect) {
        return function (this: Chai.AssertionStatic) {
            const element = util.flag(this, 'object') as Element;
            const size = getBoundaries(element)[propName];
            util.flag(this, 'object', size);
            util.flag(this, 'layout', propName);
        };
    }

    function compare(_super: (this: Chai.AssertionStatic, x: number | Element) => void) {
        return function (this: Chai.AssertionStatic, x: number | Element) {
            const layout = util.flag(this, 'layout') as Exclude<keyof DOMRect, 'toJSON'>;
            if (layout && isElement(x)) {
                _super.call(this, getBoundaries(x)[layout]);
            } else {
                _super.call(this, x);
            }
        };
    }
    const propList: Array<keyof ClientRect> = ['width', 'height', 'top', 'bottom', 'left', 'right'];
    propList.forEach((propName) => chai.Assertion.addProperty(propName, layoutProperty(propName)));

    chai.Assertion.overwriteMethod('greaterThan', compare);
    chai.Assertion.overwriteMethod('lessThan', compare);
    chai.Assertion.overwriteMethod('least', compare);
    chai.Assertion.overwriteMethod('most', compare);
    chai.Assertion.overwriteMethod('above', compare);
    chai.Assertion.overwriteMethod('below', compare);
}
