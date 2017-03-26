type VerticalAlignment = 'top' | 'center' | 'bottom';
type HorizontalAlignment = 'left' | 'center' | 'right';
interface Options {
    tolerance?: number;
    distance?: number;
}

declare module Chai {
    export interface Assertion {
        present(): Assertion;
        absent(): Assertion;

        // Layout matchers
        insideOf(boundaries: Element): Assertion;
        outsideOf(boundaries: Element): Assertion;
        widerThan(comparedTo: Element): Assertion;
        higherThan(comparedTo: Element): Assertion;
        biggerThan(comparedTo: Element): Assertion;
        verticallyAligned(alignment: VerticalAlignment, tolerance?: number): Assertion;
        horizontallyAligned(alignment: HorizontalAlignment, tolerance?: number): Assertion;
        inHorizontalSequence(options?: Options): Assertion;
        inVerticalSequence(options?: Options): Assertion;

        width: Assertion;
        height: Assertion;
        left: Assertion;
        right: Assertion;
        top: Assertion;
        bottom: Assertion;

        greaterThan(value: number | Element): Assertion;
        lessThan(value: number | Element): Assertion;
        least(value: number | Element): Assertion;
        most(value: number | Element): Assertion;
        below(value: number | Element): Assertion;
        above(value: number | Element): Assertion;
    }
}

