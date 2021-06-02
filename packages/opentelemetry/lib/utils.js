/* eslint-disable promise/no-native */
/* eslint-disable promise/prefer-await-to-then */

/**
   *
   * @param items An array of items.
   * @param fn A function that accepts an item from the array and returns a promise.
   * @returns {Promise}
   */
export function forEachPromise (items, fn) {
  return items.reduce(function (promise, item) {
    return promise.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
}