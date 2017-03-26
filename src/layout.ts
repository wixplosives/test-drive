
import {isElement} from "./scope";
interface Point {
    x: number;
    y: number;
}

type VerticalAlignment = 'top' | 'center' | 'bottom';
type HorizontalAlignment = 'left' | 'center' | 'right';

type Direction = 'vertical' | 'horizontal';

export function getBoundaries(element: Element): ClientRect {
    return element.getBoundingClientRect();
}

function isPointInside(pt: Point, boundaries: ClientRect): boolean {
    return pt.x >= boundaries.left && pt.x <= boundaries.right &&
            pt.y >= boundaries.top && pt.y <= boundaries.bottom;
}

function isInside(rect: ClientRect, boundaries: ClientRect): boolean {
    return rect.left >= boundaries.left &&
            rect.top >= boundaries.top &&
            rect.right <= boundaries.right &&
            rect.bottom <= boundaries.bottom;
}

function isOutside(rect: ClientRect, boundaries: ClientRect): boolean {
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
    return edges.reduce<number[]>((acc, edge, index) =>
        (edge >=range[0] && edge <= range[1])
            ? acc
            : acc.concat(index),
        []);
}

function getEdgeMap(edges: number[], tolerance: number): EdgeMapItem[] {
    return edges.reduce<EdgeMapItem[]>((acc, edge) => acc.concat(
        { range: [edge, edge + tolerance], excludedEdges: findExcludedEdges(edges, [edge, edge + tolerance])},
        { range: [edge, edge - tolerance], excludedEdges: findExcludedEdges(edges, [edge, edge - tolerance])}
    ), []);
}

function pickLeastExcludedEdges(edgeMap: EdgeMapItem[]): number [] {
    const excludedEdgeItem = edgeMap.reduce<EdgeMapItem | null>((acc, item) =>
        (!acc ||item.excludedEdges.length < acc.excludedEdges.length) ? item : acc,
        null);
    if(excludedEdgeItem) {
        return excludedEdgeItem.excludedEdges;
    } else {
        return [];
    }
}

export function detectMisalignment(edges: number[], tolerance: number = 0): number[] {
    const edgeMap = getEdgeMap(edges, tolerance);
    return pickLeastExcludedEdges(edgeMap);
}
type BoxProps = keyof ClientRect;

const propsByDirection: {[direction: string]: [BoxProps, BoxProps]} = {
    "horizontal": ['right', 'left'],
    "vertical": ['bottom', 'top']
};

type EdgeAccessor = (rect: ClientRect) => number;

function getEdgeAccessors(direction: Direction): [EdgeAccessor, EdgeAccessor] {
    const edgeProps = propsByDirection[direction];
    return [
        (rect: ClientRect) => rect[edgeProps[0]],
        rect => rect[edgeProps[1]]
    ]
}


function findLastElementOfSequence(elements: Element[], direction: Direction, tolerance: number, distanceBetween: number): number {
    const [farEdge, nearEdge] = getEdgeAccessors(direction);
    const boundList = elements.map(getBoundaries);
    for(let i=0; i<boundList.length-1; i++) {
        const thing = nearEdge(boundList[i+1]) - farEdge(boundList[i]);
        if (distanceBetween && thing > distanceBetween + tolerance) {
            return i + 1;
        } else if(!distanceBetween && nearEdge(boundList[i+1]) - farEdge(boundList[i]) > tolerance) {
            return i+1;
        }
    }
    return elements.length;
}

export default function use(chai: any, util: any) {
    chai.Assertion.addMethod('insideOf', function (boundaryElement: Element) {
        const element = util.flag(this, 'object');
        this.assert(isInside(getBoundaries(element), getBoundaries(boundaryElement)),
            'Expected element to be inside of the other, but it wasn\'t.',
            'Expected element not to be inside of the other, but it was.'
        );
    });

    chai.Assertion.addMethod('outsideOf', function (boundaryElement: Element) {
        const element = util.flag(this, 'object');
        this.assert(isOutside(getBoundaries(element), getBoundaries(boundaryElement)),
            'Expected element to be outside of the other, but it wasn\'t.',
            'Expected element not to be outside of the other, but it was.'
        );
    });

    chai.Assertion.addMethod('widerThan', function (comparedTo: Element) {
        const element = util.flag(this, 'object');
        this.assert(getBoundaries(element).width > getBoundaries(comparedTo).width,
            'Expected element to be wider than the other, but it wasn\'t.',
            'Expected element not to be wider than the other, but it was.'
        );
    });

    chai.Assertion.addMethod('higherThan', function (comparedTo: Element) {
        const element = util.flag(this, 'object');
        this.assert(getBoundaries(element).height > getBoundaries(comparedTo).height,
            'Expected element to be higher than the other, but it wasn\'t.',
            'Expected element not to be higher than the other, but it was.'
        );
    });

    chai.Assertion.addMethod('biggerThan', function (comparedTo: Element) {
        const element = util.flag(this, 'object');
        const elementRect: ClientRect = getBoundaries(element);
        const comparedRect: ClientRect = getBoundaries(comparedTo);
        this.assert((elementRect.width * elementRect.height) > (comparedRect.width * comparedRect.height),
            'Expected element to be bigger than the other, but it wasn\'t.',
            'Expected element not to be bigger than the other, but it was.'
        );
    });

    function assertAlignment(direction: Direction, alignment: (VerticalAlignment | HorizontalAlignment), tolerance: number) {
        const elementList: Element[] = util.flag(this, 'object');

        if (elementList.length === 0) {
            throw new Error(`Expected elements to be ${direction}ly aligned to "${alignment}" but element list was empty`);
        } else if (elementList.length === 1) {
            throw new Error(`Expected elements to be ${direction}ly aligned to "${alignment}" but element list had only one element`);
        }

        const property: BoxProps = alignment as BoxProps;
        const edges: number[] = alignment === 'center'
            ? elementList.map(element => {
                const rect = getBoundaries(element);
                if(direction === "horizontal") {
                    return (rect.left + rect.right)/2.0;
                } else {
                    return (rect.top + rect.bottom)/2.0;
                }

            })
            : elementList.map(element => getBoundaries(element)[property]);
        const misaligned = detectMisalignment(edges, tolerance);
        this.assert(misaligned.length === 0,
            `Expected elements to be ${direction}ly aligned to "${alignment}" but some weren\'t. ([${misaligned}])`,
            `Expected elements not to be ${direction}ly aligned to "${alignment}" but they were.`
        )
    }


    chai.Assertion.addMethod('verticallyAligned', function (alignment: VerticalAlignment, tolerance: number = 0) {
        assertAlignment.call(this, "vertical", alignment, tolerance);
    });

    chai.Assertion.addMethod('horizontallyAligned', function (alignment: HorizontalAlignment, tolerance: number = 0) {
        assertAlignment.call(this, "horizontal", alignment, tolerance);
    });

    function assertSequence(tolerance: number, distanceBetween: number, direction: Direction) {
        const elementList = util.flag(this, 'object');

        if (elementList.length === 0) {
            throw new Error(`Expected elements to form ${direction} sequence, but element list was empty`);
        } else if (elementList.length === 1) {
            throw new Error(`Expected elements to form ${direction} sequence, but element list had only one element`);
        }

        const lastElementOfSequence = findLastElementOfSequence(elementList, direction, tolerance, distanceBetween);
        this.assert(lastElementOfSequence === elementList.length,
            `Expected elements to form ${direction} sequence, but they didn\'t. (${lastElementOfSequence})`,
            `Expected elements not to form ${direction} sequence, but they did.`
        );
    }

    chai.Assertion.addMethod('inHorizontalSequence', function (options: Options = { tolerance: 1.0, distanceBetween: undefined }) {
        assertSequence.call(this, options.tolerance, options.distanceBetween, "horizontal");
    });

    chai.Assertion.addMethod('inVerticalSequence', function (options: Options = { tolerance: 1.0, distanceBetween: undefined }) {
        assertSequence.call(this, options.tolerance, options.distanceBetween, "vertical");
    });

    chai.Assertion.addProperty('width', function () {
        const element = util.flag(this, 'object');
        const size = getBoundaries(element).width;
        util.flag(this, 'object', size);
        util.flag(this, 'layout', 'width');
    });

    function layoutProperty(propName: keyof ClientRect) {
        return function () {
            const element = util.flag(this, 'object');
            const size = getBoundaries(element)[propName];
            util.flag(this, 'object', size);
            util.flag(this, 'layout', propName);
        }
    }

    function compare(_super: any) {
        return function (x: number | Element) {
            const layout: BoxProps = util.flag(this, 'layout') as BoxProps;
            if(layout && isElement(x)) {
                _super.call(this, getBoundaries(x)[layout]);
            } else {
                _super.call(this, x);
            }
        }

    }
    const propList: Array<keyof ClientRect> = ['width', 'height', 'top', 'bottom', 'left', 'right'];
    propList.forEach(propName => chai.Assertion.addProperty(propName, layoutProperty(propName)));

    chai.Assertion.addMethod('greaterThan', compare);
    chai.Assertion.addMethod('lessThan', compare);
    chai.Assertion.addMethod('least', compare);
    chai.Assertion.addMethod('most', compare);
    chai.Assertion.addMethod('above', compare);
    chai.Assertion.addMethod('below', compare);
}
