import { isElement } from './helpers.js';

function isPresent(element: unknown): boolean {
    return (
        isElement(element) &&
        [...element.getClientRects()].some((rectangle) => rectangle.width > 0 && rectangle.height > 0)
    );
}

export default function (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
    chai.Assertion.addMethod('present', function () {
        const element = utils.flag(this, 'object') as Element;
        this.assert(isPresent(element), 'Element expected to be present.', 'Element expected to be absent.', true);
    });

    chai.Assertion.addMethod('absent', function () {
        const element = utils.flag(this, 'object') as Element;
        this.assert(!isPresent(element), 'Element expected to be absent.', 'Element expected to be present.', true);
    });
}
