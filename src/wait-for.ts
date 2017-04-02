import Promise = require('bluebird');
export type StateAssertionFunction = () => void;

export function waitFor(assertion: StateAssertionFunction, timeout = 500, pollingInterval = 10) {
    return new Promise(function (resolve, reject) {
        function poll(cb: Function) {
            if(pollingInterval > 0) {
                setTimeout(cb, pollingInterval);
            } else {
                window.requestAnimationFrame(cb as FrameRequestCallback);
            }
        }

        function tryAssertion() {
            try {
                const returnValue = assertion();
                if (isPromise(returnValue)) {
                    throw new Error('Promises shouldn\'t be returned from within waitFor/waitForDom! Please refer to the docs for a more detailed explanation of usage');
                }
            } catch(err) {
                return err;
            }
            return null;
        }

        function isTimeOut() {
            return (new Date().getTime() - t0) >= timeout;
        }

        function nextAttempt() {
            const err = tryAssertion();
            if(err) {
                if(isTimeOut()) {
                    reject(err);
                } else {
                    poll(nextAttempt);
                }
            } else {
                resolve();
            }
        }

        const t0 = new Date().getTime();
        nextAttempt();
    });
}

export type DomStateAssertionFunction = (domRoot: Element) => void;

export function waitForDom(domRoot: Element, assertion: DomStateAssertionFunction, timeout = 500) {
    if(!('MutationObserver' in window)) {
        return waitFor(() => assertion(domRoot), timeout, 0);
    } else {
        return new Promise(function (resolve, reject) {
            let lastErr;

            function tryAssertion() {
                try {
                    const returnValue = assertion(domRoot);
                    if (isPromise(returnValue)) {
                        throw new Error('Promises shouldn\'t be returned from within waitFor/waitForDom! Please refer to the docs for a more detailed explanation of usage');
                    }
                } catch(err) {
                    return err;
                }
                return null;
            }


            if(!tryAssertion()) {
                resolve();
            } else {
                const timeoutTimer = setTimeout(function() {
                    observer.disconnect();
                    const err = tryAssertion();
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }, timeout);


                const observer = new MutationObserver(function () {
                    lastErr = tryAssertion();
                    if(!lastErr) {
                        clearTimeout(timeoutTimer);
                        observer.disconnect();
                        resolve();
                    }
                });
                observer.observe(domRoot, {
                    childList: true,
                    attributes: true,
                    characterData: true,
                    subtree: true
                });
            }
        });
    };
}

export function isPromise (object: any): boolean {
    return typeof object === 'object' && 'then' in object && typeof object.then === 'function';
}
