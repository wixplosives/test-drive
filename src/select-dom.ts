import matches from 'dom-matches';

export function selectDom(container: Element, attrName: string = 'data-automation-id') {

    function select(parentElement: Element, ...selectors: string[]): Element | null {
        const [selector, ...rest] = selectors;
        const selectorExpr = `[${attrName}~="${selector}"]`;
        const elementList = [...parentElement.querySelectorAll(selectorExpr)];

        if (matches(parentElement, selectorExpr)) {
            elementList.unshift(parentElement);
        }

        if (elementList.length === 0) {
            return null;
        } else if (elementList.length === 1) {
            const element = elementList[0];
            if (rest.length > 0) {
                return select(element, ...rest);
            } else {
                return element;
            }
        } else {
            throw new Error(`Selector "${selector}" ambiguous (${elementList.length} matches)`);
        }
    }

    return function (...selectors: string[]) {
        return select(container, ...selectors);
    }
}
