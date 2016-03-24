module.exports = {
    resolveTimeoutStarted: resolveTimeoutStarted,
    resolveTimeout: resolveTimeout,
    rejectTimeout: rejectTimeout,
    methodThatReturns: methodThatReturns,
    methodThatThrows: methodThatThrows,
}

function resolveTimeoutStarted(duration) {
    duration        = duration || 0
    var startedTime = new Date().getSeconds()

    return new Promise(resolve=> {
        setTimeout(()=> {
            //console.log(`timer startedTime ${startedTime} and took ${duration}ms`)
            resolve(startedTime)
        }, duration)
    })
}

function resolveTimeout(result, duration) {
    duration = duration || 0
    return new Promise(resolve=> {
        setTimeout(()=> {
            // console.log(`timer resolve ${duration}ms ${result}`)
            resolve(result)
        }, duration)
    })
}

function rejectTimeout(result, duration) {
    duration = duration || 0
    return new Promise((resolve, reject)=> {
        setTimeout(()=> {
            // console.log(`timer resolve ${duration}ms ${result}`)
            reject(result)
        }, duration)
    })
}

function methodThatReturns(message) {
    return message || 'reason'
}

function methodThatThrows(message) {
    throw message || 'bs'
}