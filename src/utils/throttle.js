/**
 * limits your function to be called at most every W milliseconds, where W is wait.
 * Calls over W get dropped.
 * Thanks to Pat Migliaccio.
 * see https://medium.com/@pat_migliaccio/rate-limiting-throttling-consecutive-function-calls-with-queues-4c9de7106acc
 * @param fn
 * @param wait
 * @example let throttledFunc = throttle(myFunc,500);
 */
function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function () {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

export default throttle;
