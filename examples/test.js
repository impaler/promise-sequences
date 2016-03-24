var proms = require('./../build/promise-sequences.commonjs.js')

var promiseFactories = [5, 4, 3, 2, 1].map(function (item) {
    return function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(item);
            }, item * 100);
        });
    };
});

proms.series(promiseFactories)
.then(result=>{console.log(`wow ${result}`)})