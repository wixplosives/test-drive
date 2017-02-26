export function getGlobalsOf(element: Element): any {
    if(element.ownerDocument && element.ownerDocument.defaultView) {
        return element.ownerDocument.defaultView;
    } else {
        return window;
    }
}

export function isElement(obj: any): obj is Element {
    return obj && (obj instanceof getGlobalsOf(obj)['Element']);
}

export function isHTMLElement(obj: any): obj is HTMLElement {
    return obj && (obj instanceof getGlobalsOf(obj)['HTMLElement']);
}
