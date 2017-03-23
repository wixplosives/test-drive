export function selectDom<T extends Element>(container: T, attrName: string = 'data-automation-id'): (...selectors: string[]) => T | null {

    function select(parentElement: T, ...selectors: string[]): T | null {
        const [selector, ...rest] = selectors;
        const selectorExpr = `[${attrName}~="${selector}"]`;
        const elementList: T[] = Array.prototype.slice.call(parentElement.querySelectorAll(selectorExpr));
        if(parentElement.matches(selectorExpr)) {
            elementList.unshift(parentElement);
        }
        if(elementList.length === 0) {
            return null;
        } else if(elementList.length === 1) {
            const element = elementList[0];
            if(rest.length>0) {
                return select(element, ...rest);
            } else {
                return element;
            }
        } else {
            throw new Error(`Selector "${selector}" ambiguous (${elementList.length} matches)`);
        }
    }

    return function (...selectors: string[]): T | null {
        return select(container, ...selectors);
    }
}
