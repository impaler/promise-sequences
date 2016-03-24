// var helper = require('./helpers/helper')
// var series = require('../src/pool').series
//
// fdescribe(`series allows an array of promises to execute in a
//            sequence. It can control the concurrency and return an array
//            of results it will reject on the first promise that does`, () => {
//
//     fit(`should execute promises in series three at a time and
//          stay in the correct order`, done => {
//         var expected = {
//             a: 'a result',
//             b: 'b result',
//             c: 'c result',
//             d: 'd result',
//         }
//         var tasks    = {
//             a: helper.resolveTimeout('a result'),
//             b: helper.resolveTimeout('b result'),
//             c: helper.resolveTimeout('c result'),
//             d: helper.resolveTimeout('d result'),
//         }
//
//         series(tasks, 3)
//             .then(results=> {
//                 expect(results.length).toEqual(4)
//                 expect(results).toEqual(expected)
//                 done()
//             })
//             .catch(error=> {
//                 expect('it should not have caught an error').not.toBeDefined()
//                 done()
//             })
//     })
// })
