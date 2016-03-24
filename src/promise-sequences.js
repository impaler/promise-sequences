const RESOLVED           = 'resolved'
const REJECTED           = 'rejected'
const defaultConcurrency = 1

/**
 * Invoke a series of functions that return a promise,
 * while limiting the number of concurrent promises that are invoked.
 * It returns a promise that resolves an array which contains the resolved
 * values of the promises. Any promise in the series will reject the
 * promise returned immediately just like Promise.all.
 *
 * @param promises
 * @param concurrent
 * @param step a callback to report progress on each concurrent step,
 * it will return the results of promises that have been resolved
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
                concurrentPromises = invokePromises(
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
 * @param promises
 * @param concurrent
 * @param step a callback to report progress on each concurrent step,
 * it will return the results of promises that have been resolved||rejected
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

                concurrentPromises = invokePromises(
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

export function allSettled(promises, step) {
    return seriesSettled(promises, 0, step)
}

/**
 * Push a promise or a invoke a function that returns a promise to a given array
 * @param promiseable
 * @param promises
 * @returns {*}
 */
function pushPromiseable(promiseable, promises) {
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
 * @param promises {Array}
 * @param concurrentPromises {Array}
 * @param concurrent {Number}
 * @returns {Array}
 */
function invokePromises(promises, concurrentPromises, concurrent) {
    while (concurrentPromises.length < concurrent && promises.length) {
        var promise = promises.shift()
        promise     = pushPromiseable(promise, concurrentPromises)
    }
    return concurrentPromises;
}