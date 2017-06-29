import { isInputElement } from './helpers';

export function change(target: Element | null, newValue: string): void {
    if (target) {
        if (isInputElement(target)) {
            target.focus();
            event(target, 'focus', {
                bubbles: false,
                cancelable: true
            });
            target.value = newValue;
            event(target, 'input', {
                bubbles: false,
                cancelable: true
            });
            event(target, 'change', {
                bubbles: false,
                cancelable: true
            });
        } else {
            throw new Error(`Trying to trigger "change" event on non-input element <${target.tagName}>`);
        }


    } else {
        throw new Error('Trying to trigger "change" on "null" element.');
    }
}

export function event(target: Element, type: string, payload: any): void {
    const event: Event = new Event(type, payload);
    target.dispatchEvent(event);
}

export const trigger = {
    event,
    change
};
