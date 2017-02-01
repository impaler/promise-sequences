import test from 'ava'
const {seriesSettled} = require('../src/promise-sequences')
const {rejectTimeout, resolveTimeout, methodThatThrows, methodThatReturns} = require('./helpers')

test(`seriesSettled default settings will resolve
      three promises one at a time`, async t => {
  const tasks = [
    resolveTimeout(1),
    resolveTimeout('test'),
    resolveTimeout(2),
  ]
  const results = await seriesSettled(tasks)

  t.snapshot(results)
})

test(`should execute synchronous functions and catch the settled
      results, not throwing errors`, async t => {
  const tasks = [
    methodThatThrows,
    methodThatReturns,
    methodThatThrows,
  ]
  const results = await seriesSettled(tasks)

  t.snapshot(results)
})

test(`should execute promises, functions or values together
      whether they reject or resolve`, async t => {
  const tasks = [
    'first value',
    Promise.reject('second value'),
    Promise.resolve(3),
    resolveTimeout(4),
    rejectTimeout(5),
    resolveTimeout.bind(null, 6),
    rejectTimeout.bind(null, 7),
  ]
  const results = await seriesSettled(tasks)

  t.snapshot(results)
})

test(`should execute promises in series, any promise that rejects
      will not reject the entire series.`, async t => {
  const tasks = [
    rejectTimeout(1),
    rejectTimeout(2),
    resolveTimeout(3),
    rejectTimeout(4),
    rejectTimeout(5),
  ]
  const results = await seriesSettled(tasks)

  t.snapshot(results)
})

test(`should execute a series of promises when the concurrency is
      larger than the count of the promises`, async t => {
  const concurrency = 4
  const tasks = [
    1,
    resolveTimeout(2),
    resolveTimeout.bind(null, 3),
  ]
  const results = await seriesSettled(tasks, concurrency)

  t.snapshot(results)
})

test(`execute a series of promises when the count of the promises
      is the same as the concurrency`, async t => {
  const concurrency = 3
  const tasks = [
    Promise.reject(1),
    rejectTimeout(2),
    rejectTimeout.bind(null, 3),
  ]
  const results = await seriesSettled(tasks, concurrency)

  t.snapshot(results)
})

test(`should execute execute a series with a concurrency limit of 2.
      The step function will output context on each concurrent step.
      Any promise that rejects will not reject the entire series.`, async t => {
  const concurrent = 2
  const tasks = [
    Promise.resolve(1),
    Promise.resolve(2),
    resolveTimeout(3),
    rejectTimeout(4),
    Promise.resolve(5),
    resolveTimeout(6),
  ]
  const steps = []
  const step = (value, current, total) => steps.push({value, current, total})
  const results = await seriesSettled(tasks, concurrent, step)

  t.snapshot(steps)
  t.snapshot(results)
})

test(`should should execute promises with no concurrency limit,
      any promise that rejects will not reject the entire series.`, async t => {
  const tasks = [
    resolveTimeout(1),
    resolveTimeout(2),
    rejectTimeout(3),
    resolveTimeout(4),
    rejectTimeout(5),
  ]
  const steps = []
  const step = (value, current, total) => steps.push({value, current, total})
  const results = await seriesSettled(tasks, 3, step)

  t.snapshot(steps)
  t.snapshot(results)
})
