export interface GenericInputElement {
    value: string;
    focus(): void;
}

export function getGlobalsOf(element: Element): any {
    if(element.ownerDocument && element.ownerDocument.defaultView) {
        return element.ownerDocument.defaultView;
    } else {
        return window;
    }
}

export function isInputElement(element: Element): element is Element & GenericInputElement  {
    const globalScope = getGlobalsOf(element);
    const HTMLInputElement = globalScope['HTMLInputElement'];
    const HTMLTextAreaElement = globalScope['HTMLTextAreaElement'];
    const HTMLSelectElement = globalScope['HTMLSelectElement'];
    return element instanceof  HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement;
}

export function isElement(obj: any): obj is Element {
    return obj && (obj instanceof getGlobalsOf(obj)['Element']);
}

export function isHTMLElement(obj: any): obj is HTMLElement {
    return obj && (obj instanceof getGlobalsOf(obj)['HTMLElement']);
}
