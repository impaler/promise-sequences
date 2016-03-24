var webpack = require('webpack');
var testConfig = require('./webpack-build-tests-node.config.js')
testConfig.watch = true;

webpack(testConfig, function(wow){
    console.log(wow);

    run();
})


function run() {
    var exec = require('child_process').exec;
    var child = exec('node tools/node/webpack-test.jasmine.js');
    child.stdout.on('data', function(data) {
        process.stdout.write(data)
    });
    child.stderr.on('data', function(data) {
        process.stdout.write(data)
    });
    child.on('close', function(code) {
        console.log('closing code: ' + code);
        // if(code > 0) {
        //     beep(5, 100)
        // } else {
        //     beep()
        // }
        child.kill()
    });
    return child;
}

