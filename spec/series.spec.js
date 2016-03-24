import helper from './helpers/helper'
import {series} from '../src/promise-sequences'

describe(`series allows an array of promises to execute in a sequence. It can 
          control the concurrency and return an array of results it will reject 
          on the first promise that does`, () => {

    it('should execute promises in series one at a time', done => {

        var expected = [1, 2, 3, 4, 5]
        var tasks    = [
            helper.resolveTimeout(1),
            helper.resolveTimeout(2),
            helper.resolveTimeout(3),
            helper.resolveTimeout(4),
            helper.resolveTimeout(5),
        ]

        series(tasks)
            .then(results=> {
                expect(results.length).toEqual(5)
                expect(results).toEqual(expected)
                done()
            })
            .catch(error=> {
                expect(`it should not have rejected ${error}`).not.toBeDefined()
                done()
            })
    })

    it(`should execute execute a series of promises and throw a catch on the
        first rejected promise`, done => {

        var tasks = [
            helper.rejectTimeout('error value'),
            helper.rejectTimeout.bind(this, 2),
            helper.rejectTimeout.bind(this, 2),
            helper.rejectTimeout.bind(this, 2),
        ]

        series(tasks)
            .then(()=> {
                expect('it should have caught the error').not.toBeDefined()
                done()
            })
            .catch(error=> {
                expect(error).toEqual('error value')
                done()
            })
    })

    it(`should execute execute a series of promises and throw a catch on the
        first rejected promise, despite it's position`, done => {

        var tasks = [
            helper.resolveTimeout(2),
            helper.resolveTimeout(2),
            helper.rejectTimeout.bind(null, 'error value'),
            helper.resolveTimeout(2),
        ]

        series(tasks)
            .then(result => {
                expect(`it should have resolved ${result}`).not.toBeDefined()
            })
            .catch(error=> {
                expect(error).toEqual('error value')
                done()
            })
    })

    it('should execute promises, functions or values together', done => {

        var expected = ['first value in the result', 1, 2]
        var tasks    = [
            'first value in the result',
            helper.resolveTimeout(1),
            helper.resolveTimeout.bind(null, 2),
        ]

        series(tasks, 3)
            .then(results=> {
                expect(results.length).toEqual(3)
                expect(results).toEqual(expected)
                done()
            })
            .catch(error=> {
                expect(`it should not have rejected ${error}`).not.toBeDefined()
                done()
            })
    })


    it(`should execute execute a series and operate under a strict 
        concurrency limit of 2. The step function will also output the expected
        results on each step`, done => {

        var tasks = [
            Promise.resolve(1),
            helper.resolveTimeout(2),
            helper.resolveTimeout(3),
            helper.resolveTimeout(4),
            helper.resolveTimeout(5),
            helper.resolveTimeout(6),
        ]
        var steps = []

        series(tasks, 2, step)
            .then(result => {
                expect(result.length).toEqual(6)
                expect([1, 2, 3, 4, 5, 6]).toEqual(result)
                expect(steps).toEqual([
                    [1, 2],
                    [1, 2, 3, 4],
                    [1, 2, 3, 4, 5, 6]
                ])
                done()
            })
            .catch(error=> {
                expect(`it should not have rejected ${error}`).not.toBeDefined()
                done()
            })

        function step(value, current, total) { //todo current total
            steps.push(value)
        }
    })

    it(`should execute execute a series with a concurrency limit of 3.
        The step function will output the expected results on each 
        concurrent step`, done => {

        var tasks          = [
            Promise.resolve(1),
            helper.resolveTimeout(2),
            helper.resolveTimeout(3),
            helper.resolveTimeout(4),
            helper.resolveTimeout(5),
            helper.resolveTimeout(6),
            Promise.resolve(7),
            Promise.resolve(8),
        ]
        var expectedSteps  = [
            {
                "value": [
                    1,
                    2,
                    3
                ],
                "current": 1,
                "total": 3
            },
            {
                "value": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ],
                "current": 2,
                "total": 3
            },
            {
                "value": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8
                ],
                "current": 3,
                "total": 3
            }
        ]
        var expectedResult = [1, 2, 3, 4, 5, 6, 7, 8]
        var steps          = []

        series(tasks, 3, step)
            .then(result => {
                expect(result.length).toEqual(8)
                expect(expectedResult).toEqual(result)
                expect(steps).toEqual(expectedSteps)
                done()
            })
            .catch(error=> {
                expect(`it should not have rejected ${error}`).not.toBeDefined()
                done()
            })

        function step(value, current, total) {
            steps.push({value, current, total})
        }
    })

})