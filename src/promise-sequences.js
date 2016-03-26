/** @module sequences */

const RESOLVED           = 'resolved'
const REJECTED           = 'rejected'
const defaultConcurrency = 1

/**
 * This callback is invoked to provide progress information on
 * long running a sequence. It will return the current results of promises.
 *
 * @callback stepCallback
 * @param {array} results the current results of the promises in a sequence
 * @param {number} currentStep the current step of the sequence
 * @param {number} totalSteps the current step of the sequence, this value is
 * determined by the amount of promises and the concurrency limit.
 */

/**
 * A function that returns a Promise. Putting a promise within a function
 * lets the promises to be invoked in a sequence.
 *
 * @example var resolveZero = () => Promise.resolve(0)
 * @example function() {
 *      return new Promise.resolve(1)
 * }
 *
 * @function promiseFunction
 * @returns {Promise}
 */

/**
 * Invoke a series of functions that return a promise, while limiting the
 * number of concurrent promises that are invoked.
 * It returns a promise that resolves an array which contains the resolved
 * values of each promise in the sequence. Just like Promise.all any promise
 * in the sequence will reject entire sequence immediately.
 * 
 * @param {Array.<Promise, promiseFunction>} promises to run in the sequence
 * @param {number} concurrent=1 the concurrency limit of each parallel step
 * @param {stepCallback} step a callback invoked on each concurrent
 * step of the series.
 *
 * @returns {Promise}
 */
export function series(promises, concurrent, step) {
    return new Promise((resolve, reject) => {
        promises          = promises.slice()
        concurrent        = concurrent || defaultConcurrency
        var results       = []
        var totalPromises = promises.length
        var currentStep   = 0
        var totalSteps    = Math.ceil(totalPromises / concurrent)

        next()

        function next(result) {
            var concurrentPromises = []
            if (result) {
                results = results.concat(result)
                if (step) step(results, currentStep, totalSteps)
            }
            currentStep++

            if (promises.length) {
                concurrentPromises = pushPromiseable(
                    promises, concurrentPromises, concurrent
                )
                Promise.all(concurrentPromises)
                    .then(next)
                    .catch(error => reject(error))
            } else {
                resolve(results)
            }
        }
    })
}

/**
 * Invoke a series of functions that return a promise,
 * while limiting the number of concurrent promises that are invoked.
 * The promise returned will not reject if any promise promise fails
 *
 * @param {Array.<Promise, promiseFunction>} promises to run in the sequence
 * @param {number} concurrent=1 the concurrency limit of each parallel step
 * @param {stepCallback} step a callback invoked on each concurrent
 * step of the series.
 *
 * @returns {Promise}
 */
export function seriesSettled(promises, concurrent, step) {
    return new Promise(resolve => {
        promises              = promises.slice()
        concurrent            = concurrent || defaultConcurrency
        var results           = []
        var totalPromises     = promises.length
        var currentStep       = 0
        var totalSteps        = Math.ceil(totalPromises / concurrent)
        var concurrentCounter = 0

        next()

        function next() {
            var concurrentPromises = []

            if (promises.length > 0) {
                currentStep++
                concurrentCounter = 0

                concurrentPromises = pushPromiseable(
                    promises, concurrentPromises, concurrent
                )
                for (var promise of concurrentPromises) {
                    concurrentCounter++
                    promise
                        .then(value => stepResult(value, RESOLVED))
                        .catch(error => stepResult(error, REJECTED))
                }
            } else if (currentStep === totalSteps && concurrentCounter === 0) {
                resolve(results)
            }
        }

        function stepResult(result, state) {
            concurrentCounter--
            results = results.concat([{state, result}])
            if (step && concurrentCounter === 0) {
                step(results, currentStep, totalSteps)
            }

            if (concurrentCounter === 0)
                next()
        }
    })
}

/**
 * Invoke an array of promises similar to Promise.all, except it will
 * continue if any promises are rejected.
 *
 * @param {Array.<Promise, promiseFunction>} promises to run in the sequence
 * @param {stepCallback} step a callback invoked on each concurrent
 * step of the series.
 *
 * @returns {Promise}
 */
export function allSettled(promises, step) {
    return seriesSettled(promises, 0, step)
}

/**
 * Push a promise or a invoke a function that returns a promise to a given array
 *
 * @param {(promiseFunction|Promise)} promiseable
 * @param {Array.<Promise, promiseFunction>} promises array to push the pomises to
 *
 * @private
 * @returns {Array.<Promise>}
 */
function invokePromises(promiseable, promises) {
    // lets assume a function will return a promise and reject any errors
    if (typeof promiseable === 'function') {
        try {
            promiseable = promiseable()
        } catch (error) {
            promiseable = Promise.reject(error)
        }
    }
    // if it's not a native promise or something thenable,
    // just resolve it as a synchronous value
    if (!(promiseable instanceof Promise ||
        typeof Object.getPrototypeOf(promiseable).then === 'function')) {
        promiseable = Promise.resolve(promiseable)
    }

    promises.push(promiseable)

    return promiseable
}

/**
 * Invoke and push a given array of promise like objects into an array under
 * a concurrent limit.
 * an array.
 *
 * @private
 * @param {Array.<Promise, promiseFunction>} promises to run in the sequence
 * @param {Array.<Promise>} concurrentPromises promises that the invoked promises will
 * be pushed upon
 * @param {Number} concurrent the limit of promises to invoke
 * @returns {Array.<Promise>}
 */
function pushPromiseable(promises, concurrentPromises, concurrent) {
    while (concurrentPromises.length < concurrent && promises.length) {
        var promise = promises.shift()
        promise     = invokePromises(promise, concurrentPromises)
    }
    return concurrentPromises;
}