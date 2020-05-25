import { isElement } from './helpers';

function isPresent(element: unknown): boolean {
    return (
        isElement(element) &&
        [...element.getClientRects()].some((rectangle) => rectangle.width > 0 && rectangle.height > 0)
    );
}

export default function (chai: Chai.ChaiStatic, util: Chai.ChaiUtils): void {
    chai.Assertion.addMethod('present', function () {
        const { flag } = util;
        const element = flag(this, 'object') as Element;
        this.assert(isPresent(element), 'Element expected to be present.', 'Element expected to be absent.', true);
    });

    chai.Assertion.addMethod('absent', function () {
        const { flag } = util;
        const element = flag(this, 'object') as Element;
        this.assert(!isPresent(element), 'Element expected to be absent.', 'Element expected to be present.', true);
    });
}
