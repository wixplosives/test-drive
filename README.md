# Test Drive

[![npm version](https://badge.fury.io/js/test-drive.svg)](https://www.npmjs.com/package/test-drive)
[![Build Status](https://github.com/wixplosives/test-drive/workflows/tests/badge.svg)](https://github.com/wixplosives/test-drive/actions)

**Test Drive** is an opinionated, yet framework-agnostic collection of tools, matchers and helpers for efficient Test Driven Development of web applications, GUIs and client-side components. Based on existing Open Source projects, as well as original contributions and ideas, it provides not only practical and efficient solutions for writing reliable tests, but also methodological guidelines based on long-term experimentation and hard-won lessons.

## Installation

test-drive can be installed via the npm registry:

```
npm i test-drive --save-dev
```

If using TypeScript, several @types packages are required as well:

```
npm i @types/chai @types/sinon @types/sinon-chai @types/chai-dom @types/chai-as-promised --save-dev
```

**test-drive** exports _sinon_ and _chai_ via its main entry point. chai's _expect_ is also directly exported, and is pre-loaded with chai-as-promised, chai-dom, sinon-chai, and chai-style assertions.

## How to write tests

### Locating your DOM parts: `selectDOM()`

`selectDom(container: Element, attrName: string = 'data-automation-id')`

Returns DOM selector function for the `container`, using attribute `attrName`.
DOM selector is a function accepting one or more string identifiers.

Example:

```tsx
const select = selectDOM(document.body, 'my-id');
const element = select('panel1', 'button-ok');
```

This code will find, inside the document body, element with attribute
"myId" containing word "panel1" and inside it element with the same
attribute containing word "button-ok".

`element` will be null, if such path cannot be resolved ("button-ok" or
even "panel1" cannot be found).

The function `select` will throw an exception, if the path is ambiguous
(e.g., "panel1" contains more than one "button-ok").

### The `.present()` and `.absent()` matchers

Often, components have parts which are sometimes present, sometimes
absent, depending on their configuration or state. As there are many
possibilities how such "re-appearance" can be implemented, this kit
provides a matcher that abstracts such internal implementation away.

Example:

```tsx
expect(element).to.be.present();
expect(element).to.be.absent();

expect(element).not.to.be.present();
expect(element).not.to.be.absent();
```

"Presence" is defined as follows:

- "element" is not null
- "element" is an instance of `Element`
- some part of "element" has real size (defined as `ClientRect` whose
  both `width` and `height` are greater than zero)

(This definition is inspired by [jQuery's `:visible` selector](https://api.jquery.com/visible-selector/), but not
necessarily compliant with it.)

### Layout Matchers

Using layout matchers, component developers can implement tests which assert relations between various parts of the
component in terms of position in the document. Layout matchers abstract away the actual DOM structure and CSS rules,
as they are based solely on
[absolute location of bounding rectangles](https://developer.mozilla.org/en-US/docs/Web/API/Element/getClientRects). With
the right **combination** of layout matchers, one should be able describe most of spatial relationships within components.

The parts are passed as references to `HTMLElement`.

[Tests of layout matchers](test/layout.spec.ts) should provide exhaustive examples on how to use the matchers.

### Placement

`.insideOf(x)` asserts that the subject is completely within the boundaries of element `x`.

`.outsideOf(x)` asserts the the subject is completely outside the boundaries of element `x`.

If the subject is partly inside and partly outside, none of the matchers passes.

Example:

```javascript
expect(button).to.be.insideOf(panel);
```

### Box Properties

Box properties of an element (`width`, `height`, `left`, `top`, `right`, `bottom`) can be measured
and asserted with numeric matchers, such as:

```javascript
expect(button1).to.have.width.equal(10);
```

Elements can also be compared with `greaterThan()`, `above()`, `lessThan()`, `below()`, `at.least()` and `at.most()`:

```javascript
expect(button1).to.have.height.greaterThan(button2);
```

At the same time, numeric comparisons will still work:

```javascript
expect(button1).to.have.height.greaterThan(10);
```

Note that `top` and `bottom` will be compared as numbers. So `bottom = 50` will still be "below" `bottom = 100`, even though
visually it will, of course, appear "above".

### Alignment

`.horizontallyAligned("left" | "center" | "right, tolerance = 0.0)`

`.verticallyAligned("top" | "center" | "bottom", tolerance = 0.0)`

The alignment matchers assert that _all elements within a list_ are properly aligned with each other, with optional tolerance range.

Example:

```javascript
expect([button1, button2, button3]).to.be.verticallyAligned('top', 1.5);
```

### Sequence

`.inHorizontalSequence({ distance = 0.0, tolerance = 1.0 })`

`.inVerticalSequence({ distance = 0.0, tolerance = 1.0 })`

Asserts that _all elements within a list_ form uninterrupted sequence, one adjacent to the other, without gaps.

Example:

```javascript
expect([button1, button2, button3]).to.be.inHorizontalSequence({ distance: 10.0 });
```

### Style

_via [chai-style](https://github.com/darlanmendonca/chai-style)_

`.style(styleName, styleValue)`

Asserts that element has style attribute with matching value, regardless of browser-specific value.

Example:

```javascript
expect(button).to.have.style('background-color', 'green');
```

# License

MIT
