// var isNodeJS = false;
// try {
//     require('fs')
//     isNodeJS = process && process.release && (process.release.name === 'node')
// } catch (error) {
//     isNodeJS = false
// }
//
// import {series} from '../src/series'
//
// if (isNodeJS) {
//
//     var path       = require('path')
//     var fs         = require('fs')
//     var promisify  = require('es6-promisify')
//     var writeFile  = promisify(fs.writeFile)
//     var appendFile = promisify(fs.appendFile)
//     var readFile   = promisify(fs.readFile)
//     var unlink     = promisify(fs.unlink)
//     var stat       = promisify(fs.stat)
//
//     describe('Example of promisifying fs methods', () => {
//
//         it('should execute the asynchronous nodejs core apis in series', done => {
//
//             var logTest  = ['log 0', 'log 1']
//             var fileName = path.join(process.cwd(), 'test-artifacts/test.txt')
//
//             series([
//                 appendFile.bind(null, fileName, logTest.shift()),
//                 stat.bind(null, fileName),
//                 appendFile.bind(null, fileName, logTest.shift()),
//                 readFile.bind(null, fileName),
//                 unlink.bind(null, fileName),
//             ])
//                 .then(results=> {
//                     expect(results.length).toEqual(5)
//                     expect(results[1].atime).toBeDefined()
//                     expect(results[3].toString()).toEqual('log 0log 1')
//                     done()
//                 })
//                 .catch(error=> {
//                     expect(`it should not have rejected ${error}`).not.toBeDefined()
//                     done();
//                 })
//         })
//
//         // var fileNames = [
//         //     'artifacts/test0.txt',
//         //     'artifacts/test1.txt'
//         // ]
//         // var result = await downloadFiles(fileNames)
//         //
//         // var resultMessage = results.hasRejected(result) ?
//         //     `Failed to download a total of ${results.rejected(result).length}` :
//         //     `There were no errors`
//         //
//         //
//         // async function downloadFiles(fileNames) {
//         //     var downloadTasks = fileNames
//         //         .map(file=>`${endpoint}/file`)
//         //         .map(url=> fetch(url))
//         //
//         //     await series(downloadTasks, 1, ({current, total})=> ::console.log)
//         // }
//
//
//         // return Promise.any([
//         //     fetch('http://weather1.example.com', { city: city }),
//         //     fetch('http://weather2.example.com', { city: city }),
//         //     fetch('http://weather3.example.com', { city: city })
//         // ]);
//     })
// }