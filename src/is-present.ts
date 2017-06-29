import { isElement } from './helpers';

function isPresent(element: any): boolean {
    if (isElement(element)) {
        const rects = Array.prototype.slice.call(element.getClientRects()) as ClientRect[];
        return rects.some(rectangle => rectangle.width > 0 && rectangle.height > 0);
    } else {
        return false;
    }
}

export default function (chai: any, util: any) {
    chai.Assertion.addMethod('present', function () {
        const { flag } = util;
        const element = flag(this, 'object');
        this.assert(isPresent(element),
            'Element expected to be present.',
            'Element expected to be absent.'
        );
    });

    chai.Assertion.addMethod('absent', function () {
        const { flag } = util;
        const element = flag(this, 'object');
        this.assert(!isPresent(element),
            'Element expected to be absent.',
            'Element expected to be present.'
        );
    });
}
