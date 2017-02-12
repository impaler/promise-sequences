export function resolveTimeout (result, duration) {
  duration = duration || 0
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(result)
    }, duration)
  })
}

export function rejectTimeout (result, duration) {
  duration = duration || 0
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(result)
    }, duration)
  })
}

export function methodThatReturns(message) {
  return message || 'reason';
}

export function methodThatThrows(message) {
  throw message || 'bs';
}
