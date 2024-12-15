import { expect } from '../index.js';

describe('isPresent() matcher detects', function () {
    this.timeout(5_000);

    let container: HTMLElement;

    beforeEach(function () {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(function () {
        document.body.removeChild(container);
    });

    it('normal visible element as present (various styles)', function () {
        container.innerHTML = `
            <div>
                <div id="myElement">Normal visible element</div>
            </div>
        `;
        const element = container.querySelector('#myElement');
        expect(element).to.be.present();
        expect(element).not.to.be.absent();
        expect(() => expect(element).not.to.be.present()).to.throw('Element expected to be absent.');
        expect(() => expect(element).to.be.absent()).to.throw('Element expected to be absent.');
    });

    it('null as absent (various styles)', function () {
        expect(null).to.be.absent();
        expect(null).not.to.be.present();
        expect(() => expect(null).to.be.present()).to.throw('Element expected to be present.');
        expect(() => expect(null).not.to.be.absent()).to.throw('Element expected to be present.');
    });

    it('undefined/nonsense as absent', function () {
        expect(undefined).to.be.absent();
        expect('pure nonsense').to.be.absent();
    });

    it('display:none element as absent', function () {
        container.innerHTML = `
            <div>
                <div id="myElement" style="display: none">Normal visible element</div>
            </div>
        `;
        const element = container.querySelector('#myElement');
        expect(element).to.be.absent();
    });

    it('element with no size as absent', function () {
        container.innerHTML = `
            <div>
                <div id="myElement"></div>
            </div>
        `;
        const element = container.querySelector('#myElement');
        expect(element).to.be.absent();
    });

    it('svg elements as present', function () {
        container.innerHTML = `
            <svg id="svgTest" xmlns="http://www.w3.org/2000/svg" width="150" height="100" viewBox="0 0 3 2">
                <rect width="1" height="2" x="0" fill="#008d46" />
                <rect width="1" height="2" x="1" fill="#ffffff" />
                <rect width="1" height="2" x="2" fill="#d2232c" />
            </svg>
        `;
        const element = container.querySelector('#svgTest');
        expect(element).to.be.present();
    });
});
