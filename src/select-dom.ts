export function selectDom(container: Element, attrName: string = 'data-automation-id') {

    function select<T extends Element>(parentElement: Element, ...selectors: string[]): T | null {
        const [selector, ...rest] = selectors;
        const elementList = parentElement.querySelectorAll(`[${attrName}~="${selector}"]`);
        if (elementList.length === 0) {
            return null;
        } else if (elementList.length === 1) {
            const element = elementList[0];
            if (rest.length > 0) {
                return select<T>(element, ...rest);
            } else {
                return element as T;
            }
        } else {
            throw new Error(`Selector "${selector}" ambiguous (${elementList.length} matches)`);
        }
    }

    return function <T extends Element>(...selectors: string[]) {
        return select<T>(container, ...selectors);
    }
}
