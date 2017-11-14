import { isInputElement } from './helpers';

export function eventSimple(target: Element, type: string, eventInitDict?: EventInit): void {
    const event: Event = new Event(type, eventInitDict);
    target.dispatchEvent(event);
}

// for browsers without event constructors (IE11)
export function eventCompat(target: Element, type: string, eventInitDict?: EventInit): void {
    const event: Event = document.createEvent('Event');
    const {bubbles = true, cancelable = true} = eventInitDict || {};
    event.initEvent(type, bubbles , cancelable);
    target.dispatchEvent(event);
}

export const event = typeof Event === 'function' ? eventSimple : eventCompat;

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

export const trigger = {
    event,
    change
};
