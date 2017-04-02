import { isPromise, expect } from '../src';
import Promise = require('bluebird');

describe('The isPromise function', function () {
   it('should return true if passed a native es6 promise', function () {
       const promiseEs6 = new Promise(() => {});

       expect(isPromise(promiseEs6)).to.be.true;
   });

   it('should return false if passed something other than a promise', function () {
      const notPromise = () => {};

      expect(isPromise(notPromise)).to.be.false;;
   });
});
