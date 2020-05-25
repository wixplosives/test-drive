export interface GenericInputElement {
    value: string;
    focus(): void;
}

export function getGlobalsOf(element: Element): Window & typeof globalThis {
    return (element.ownerDocument?.defaultView as Window & typeof globalThis) ?? window;
}

export function isInputElement(element: Element): element is Element & GenericInputElement {
    const globalScope = getGlobalsOf(element);
    const HTMLInputElement = globalScope['HTMLInputElement'];
    const HTMLTextAreaElement = globalScope['HTMLTextAreaElement'];
    const HTMLSelectElement = globalScope['HTMLSelectElement'];
    return (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
    );
}

export function isElement(obj: unknown): obj is Element {
    return obj && obj instanceof getGlobalsOf(obj as Element)['Element'];
}

export function isHTMLElement(obj: unknown): obj is HTMLElement {
    return obj && obj instanceof getGlobalsOf(obj as Element)['HTMLElement'];
}
