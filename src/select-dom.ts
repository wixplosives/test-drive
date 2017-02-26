export type SelectionResult = Element | null;

export function selectDom(container: Element, attrName: string = 'data-automation-id'): (...selectors: string[]) => SelectionResult {

    function select(parentElement: Element, ...selectors: string[]): SelectionResult {
        const [selector, ...rest] = selectors;
        const elementList = parentElement.querySelectorAll(`[${attrName}~="${selector}"]`);
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

    return function (...selectors: string[]): SelectionResult {
        return select(container, ...selectors);
    }
}
