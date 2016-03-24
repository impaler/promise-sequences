import helper from './helpers/helper'
import {seriesSettled, allSettled} from '../src/promise-sequences'

describe('seriesSettled allows an array of promises to execute in a ' +
    'sequence. It can control the concurrency and return an array ' +
    'of results whether it resolves or rejects', () => {

    it('should execute promises in series one at a time', done => {
        var expected = [
            {
                "state": "resolved",
                "result": 1
            },
            {
                "state": "resolved",
                "result": "test"
            },
            {
                "state": "resolved",
                "result": 2
            },
        ]
        var tasks    = [
            helper.resolveTimeout(1),
            helper.resolveTimeout('test'),
            helper.resolveTimeout(2),
        ]

        seriesSettled(tasks)
            .then(results=> {
                expect(results.length).toEqual(3)
                expect(results).toEqual(expected)
                done()
            })
            .catch(error=> {
                expect('it should not have caught an error').not.toBeDefined()
                done()
            })
    })

    it(`should execute synchronous functions and resolve or reject their 
        return values`, done => {
        var expected = [
            {
                "state": "rejected",
                "result": "bs"
            },
            {
                "state": "resolved",
                "result": "reason"
            },
            {
                "state": "rejected",
                "result": "bs"
            }
        ]
        var tasks    = [
            helper.methodThatThrows,
            helper.methodThatReturns,
            helper.methodThatThrows,
        ]

        seriesSettled(tasks)
            .then(results=> {
                expect(results.length).toEqual(3)
                expect(results).toEqual(expected)
                done()
            })
            .catch(error=> {
                expect('it should not have caught an error').not.toBeDefined()
                done()
            })
    })

    it(`should execute promises, functions or values together whether
        they reject or resolve`, done => {

        var expected = [
            {
                "state": "resolved",
                "result": "first value in the result"
            },
            {
                "state": "rejected",
                "result": "first value in the result"
            },
            {
                "state": "resolved",
                "result": 1
            },
            {
                "state": "resolved",
                "result": 2
            },
            {
                "state": "rejected",
                "result": 3
            },
            {
                "state": "resolved",
                "result": 4
            },
            {
                "state": "rejected",
                "result": 5
            }
        ]
        var tasks    = [
            'first value in the result',
            Promise.reject('first value in the result'),
            Promise.resolve(1),
            helper.resolveTimeout(2),
            helper.rejectTimeout(3),
            helper.resolveTimeout.bind(null, 4),
            helper.rejectTimeout.bind(null, 5),
        ]

        seriesSettled(tasks)
            .then(results=> {
                expect(results.length).toEqual(7)
                expect(results).toEqual(expected)
                done()
            })
            .catch(error=> {
                expect(`it should not have rejected ${error}`).not.toBeDefined()
                done()
            })
    })

    it(`should execute promises in series, any promise that rejects will 
        not reject the entire series.`, done => {
        var expected = [
            {
                "state": "rejected",
                "result": "error value"
            },
            {
                "state": "rejected",
                "result": 2
            },
            {
                "state": "resolved",
                "result": 2
            },
            {
                "state": "rejected",
                "result": 2
            },
            {
                "state": "rejected",
                "result": 2
            }
        ]
        var tasks    = [
            helper.rejectTimeout('error value'),
            helper.rejectTimeout(2),
            helper.resolveTimeout(2),
            helper.rejectTimeout(2),
            helper.rejectTimeout(2),
        ]

        seriesSettled(tasks)
            .then(results=> {
                expect(results.length).toEqual(5)
                expect(results).toEqual(expected)
                done()
            })
            .catch(error=> {
                expect('it should not have caught an error').not.toBeDefined()
                done()
            })
    })

    it(`should execute a series of promises when the concurrency is
        larger than the count of the promises`, done => {

        var concurrency = 4
        var expected    = [
            {
                "state": "resolved",
                "result": "first value in the result"
            },
            {
                "state": "resolved",
                "result": 1
            },
            {
                "state": "resolved",
                "result": 2
            }
        ]
        var tasks       = [
            'first value in the result',
            helper.resolveTimeout(1),
            helper.resolveTimeout.bind(null, 2),
        ]

        seriesSettled(tasks, concurrency)
            .then(results=> {
                expect(results.length).toEqual(3)
                expect(results).toEqual(expected)
                done()
            })
            .catch(error=> {
                expect('it should not have caught an error').not.toBeDefined()
                done()
            })
    })

    it(`execute a series of promises when the count of the promises
        is the same as the concurrency`, done => {

        var concurreny = 3;
        var expected   = [
            {
                "state": "rejected",
                "result": "first value in the result"
            },
            {
                "state": "rejected",
                "result": 1
            },
            {
                "state": "rejected",
                "result": 2
            }
        ]
        var tasks      = [
            Promise.reject('first value in the result'),
            helper.rejectTimeout(1),
            helper.rejectTimeout.bind(null, 2),
        ]

        seriesSettled(tasks, concurreny)
            .then(results=> {
                expect(results.length).toEqual(concurreny)
                expect(results).toEqual(expected)
                done()
            })
            .catch(error=> {
                expect('it should not have caught an error').not.toBeDefined()
                done()
            })
    })

    it(`should execute execute a series with a concurrency limit of 2.
        The step function will output the expected results on each concurrent 
        step. Any promise that rejects will not reject the entire series.`,
        done => {

            var concurrent    = 2;
            var expected      = [
                {
                    "state": "resolved",
                    "result": 1
                },
                {
                    "state": "resolved",
                    "result": 2
                },
                {
                    "state": "resolved",
                    "result": 3
                },
                {
                    "state": "rejected",
                    "result": 4
                },
                {
                    "state": "resolved",
                    "result": 5
                },
                {
                    "state": "resolved",
                    "result": 6
                }
            ]
            var expectedSteps = [
                {
                    "value": [
                        {
                            "state": "resolved",
                            "result": 1
                        },
                        {
                            "state": "resolved",
                            "result": 2
                        }
                    ],
                    "current": 1,
                    "total": 3
                },
                {
                    "value": [
                        {
                            "state": "resolved",
                            "result": 1
                        },
                        {
                            "state": "resolved",
                            "result": 2
                        },
                        {
                            "state": "resolved",
                            "result": 3
                        },
                        {
                            "state": "rejected",
                            "result": 4
                        }
                    ],
                    "current": 2,
                    "total": 3
                },
                {
                    "value": [
                        {
                            "state": "resolved",
                            "result": 1
                        },
                        {
                            "state": "resolved",
                            "result": 2
                        },
                        {
                            "state": "resolved",
                            "result": 3
                        },
                        {
                            "state": "rejected",
                            "result": 4
                        },
                        {
                            "state": "resolved",
                            "result": 5
                        },
                        {
                            "state": "resolved",
                            "result": 6
                        }
                    ],
                    "current": 3,
                    "total": 3
                }
            ]

            var tasks = [
                Promise.resolve(1),
                Promise.resolve(2),
                helper.resolveTimeout(3),
                helper.rejectTimeout(4),
                Promise.resolve(5),
                helper.resolveTimeout(6),

            ]
            var steps = []

            seriesSettled(tasks, concurrent, step)
                .then(results=> {
                    expect(steps).toEqual(expectedSteps)
                    expect(results.length).toEqual(6)
                    expect(results).toEqual(expected)
                    done()
                })
                .catch(error=> {
                    expect('it should not have caught an error').not.toBeDefined()
                    done()
                })

            function step(value, current, total) {
                steps.push({value, current, total})
            }
        })


    it(`should should execute promises with no concurrency limit,
        any promise that rejects will not reject the entire series.`, done => {

        var expected      = [
            {
                "state": "resolved",
                "result": 1
            },
            {
                "state": "resolved",
                "result": 2
            },
            {
                "state": "rejected",
                "result": 3
            },
            {
                "state": "resolved",
                "result": 4
            },
            {
                "state": "rejected",
                "result": 5
            }
        ]
        var expectedSteps = [
            {
                "value": [
                    {
                        "state": "resolved",
                        "result": 1
                    }
                ],
                "current": 1,
                "total": 5
            },
            {
                "value": [
                    {
                        "state": "resolved",
                        "result": 1
                    },
                    {
                        "state": "resolved",
                        "result": 2
                    }
                ],
                "current": 2,
                "total": 5
            },
            {
                "value": [
                    {
                        "state": "resolved",
                        "result": 1
                    },
                    {
                        "state": "resolved",
                        "result": 2
                    },
                    {
                        "state": "rejected",
                        "result": 3
                    }
                ],
                "current": 3,
                "total": 5
            },
            {
                "value": [
                    {
                        "state": "resolved",
                        "result": 1
                    },
                    {
                        "state": "resolved",
                        "result": 2
                    },
                    {
                        "state": "rejected",
                        "result": 3
                    },
                    {
                        "state": "resolved",
                        "result": 4
                    }
                ],
                "current": 4,
                "total": 5
            },
            {
                "value": [
                    {
                        "state": "resolved",
                        "result": 1
                    },
                    {
                        "state": "resolved",
                        "result": 2
                    },
                    {
                        "state": "rejected",
                        "result": 3
                    },
                    {
                        "state": "resolved",
                        "result": 4
                    },
                    {
                        "state": "rejected",
                        "result": 5
                    }
                ],
                "current": 5,
                "total": 5
            }
        ]

        var tasks = [
            helper.resolveTimeout(1),
            helper.resolveTimeout(2),
            helper.rejectTimeout(3),
            helper.resolveTimeout(4),
            helper.rejectTimeout(5),
        ]
        var steps = []

        allSettled(tasks, step)
            .then(results=> {
                expect(results.length).toEqual(5)
                expect(steps).toEqual(expectedSteps)
                expect(results).toEqual(expected)
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
