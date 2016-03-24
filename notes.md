
For example say you want to make 8 requests to a web service, but 
only want to make 2 requests at a time:

```
//https://github.com/HackerNews/API

let fetchUrls = [
    'https://hacker-news.firebaseio.com/v0/topstories.json'
]

```


// fetch('//offline-news-api.herokuapp.com/stories')
//     .then(function(response) {
//         if (response.status >= 400) {
//             throw new Error("Bad response from server");
//         }
//         return response.json();
//     })
//     .then(function(stories) {
//         console.log(stories);
//     });

Promise.all in the es2015 spec handles promises with a [fail-fast
behaviour](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise/all),
which this library also provides an alternative with allSettled.

This library is built for nodejs and browsers using webpack.
The tests are also run on both environments.

Please make sure your target includes Promise implementation otherwise
you can make use of a polyfill.

A library like es6-promisify you can use the callback based nodejs std lib

### https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html

The reason this happens is that you don't want to operate over an array of promises at all. Per the promise spec, as soon as a promise is created, it begins executing. So what you really want is an array of promise factories:

function executeSequentially(promiseFactories) {
  var result = Promise.resolve();
  promiseFactories.forEach(function (promiseFactory) {
    result = result.then(promiseFactory);
  });
  return result;
}
I know what you're thinking: "Who the hell is this Java programmer, and why is he talking about factories?" A promise factory is very simple, though – it's just a function that returns a promise:

function myPromiseFactory() {
  return somethingThatCreatesAPromise();
}


allSettled similar to [q.allSettled](https://github.com/kriskowal/q/wiki/API-Reference#promiseallsettled)

### webpack for nodejs
http://jlongster.com/Backend-Apps-with-Webpack--Part-I

Use example * imports
import * as pf from 'promise-flow';
 
pf.allObject({
  key1: Promise.resolve('value from a promise'),
  key2: 'non-promise value'
}).then(function(result) {
  // result == { key1: 'value from a promise', key2: 'non-promise value' } 
});

var promiseFactories = [5, 4, 3, 2, 1].map(function (item) {
    return function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(item);
            }, item * 100);
        });
    };
});
promiseConcurrency(promiseFactories, 2).then(function (value) {
    console.log(value); // => [5, 4, 3, 2, 1]
});