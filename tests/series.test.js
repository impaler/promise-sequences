import test from 'ava'
const {series} = require('../src/promise-sequences')
const {rejectTimeout, resolveTimeout} = require('./helpers')

test('should execute promises in series one at a time', async t => {
  const tasks = [
    resolveTimeout(1),
    resolveTimeout(2),
    resolveTimeout(3),
    resolveTimeout(4),
    resolveTimeout(5),
  ]
  const results = await series(tasks)

  t.is(results.length, 5)
  t.deepEqual(results, [1, 2, 3, 4, 5])
})

test('should execute execute a series of promises and throw a catch on the first rejected promise', async t => {
  const tasks = [
    resolveTimeout.bind(this, 2),
    resolveTimeout.bind(this, 2),
    rejectTimeout('error value'),
    rejectTimeout.bind(this, 2),
  ]
  try {
    await series(tasks)
  } catch (error) {
    t.is(error, 'error value')
  }
})

test('should execute execute a series of promises and throw a catch on the first rejected promise', async t => {
  const tasks = [
    'first value in the result',
    resolveTimeout(1),
    resolveTimeout.bind(null, 2),
  ]
  const results = await series(tasks, 3)

  t.is(results.length, 3)
  t.deepEqual(results, ['first value in the result', 1, 2])
})

test(`should execute execute a series and operate under a concurrency limit of 2.
      The step function will also output the expected results on each step`, async t => {
  const tasks = [
    Promise.resolve(1),
    resolveTimeout(2),
    resolveTimeout(3),
    resolveTimeout(4),
    resolveTimeout(5),
    resolveTimeout(6),
  ]
  const steps = []
  const step = (value, current, total) => steps.push(value)
  const result = await series(tasks, 2, step)

  t.is(result.length, 6)
  t.deepEqual(result, [1, 2, 3, 4, 5, 6])
  t.deepEqual(steps, [
    [1, 2],
    [1, 2, 3, 4],
    [1, 2, 3, 4, 5, 6]
  ])
})

test(`should execute execute a series with a concurrency limit of 3. 
      The step function will output the expected results on each concurrent step`, async t => {
  const tasks = [
    Promise.resolve(1),
    resolveTimeout(2),
    resolveTimeout(3),
    resolveTimeout(4),
    resolveTimeout(5),
    resolveTimeout(6),
    Promise.resolve(7),
    Promise.resolve(8),
  ]
  const steps = []
  const step = (value, current, total) => steps.push(value)
  const result = await series(tasks, 3, step)

  t.is(result.length, 8)
  t.deepEqual([1, 2, 3, 4, 5, 6, 7, 8], result)
  t.snapshot(steps)
})

test(`should invoke 100 promises only 3 at a time`, async t => {
  const total = 100
  const tasks = Array(total).fill(resolveTimeout.bind(null, 0, 0))
  const steps = []
  const step = (value, current, total) => steps.push(value)
  const result = await series(tasks, 3, step)

  t.is(result.length, total)
  t.snapshot(steps)
  t.snapshot(result)
})
