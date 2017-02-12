# promise-sequences

[![Build Status](https://travis-ci.org/impaler/promise-sequences.svg?branch=master)](https://travis-ci.org/impaler/promise-sequences)

A small library to control a sequence of promises with concurrency limiting.
There are zero dependencies, it expects you are using a javascript runtime with Promise support or a polyfill.

## Why?

When working with promise apis the standard [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) will allow you to run promises in parallel. Controlling the limit of how many can run concurrently is not part of the api, this library offers a simple solution. For example say you want to download 100 images, 3 at a time and continue downloading if one download task throws an error. Lets see how you can do it:

First, install the package from npm

```
npm i promise-sequences
```

```javascript
import { seriesSettled } from 'promise-sequences'

const imageDownloadTasks = [
  fetch('http://image/0.png'),
  ... // the 100 images, you could generate this array from some datasource
]

seriesSettled(imageDownloadTasks, 3) // 3 at a time
  .then(results => {
    console.log(results)
    // now you can do what you need to with the response of the urls
  })
```

There are two main apis, `series` and `seriesSettled`.

### `series(sequence[() => Promise], concurrent, stepCallback)`

Just like standard `Promise.all` a series will reject on the first failure. You can easily control the concurrency with the second parameter.

```javascript
import {series} from 'promise-sequences'

const fetchImages = [
  fetch('http://openclipart.org/image/2400px/svg_to_png/271178/old-man.png'),
  fetch('https://openclipart.org/image/300px/svg_to_png/271966/doctorsandsurgery.png'),
]

series(fetchImages, 1)
  .then(results => {
    let statusCodes = results.map(response => response.status)
    console.log(statusCodes) // [200, 200]
  })
```

### `allSettled(sequence[() => Promise], concurrent, stepCallback)`

This sequence will continue a even if one of the items in the sequence rejects. So that you can easily process the results, each item will have an object with the the `state` ('resolved'|'rejected') and the `result` (the rejected or resolved value). The parameters for concurrency are the same.

```javascript
import { seriesSettled } from 'promise-sequences'

const fetchImages = [
  fetch('http://openclipart.org/image/2400px/svg_to_png/271178/old-man.png'),
  fetch('https://invalid-image-url.png'),
  fetch('https://openclipart.org/image/300px/svg_to_png/271966/doctorsandsurgery.png'),
]

seriesSettled(fetchImages, 1)
  .then(results => {
    console.log(results)
    // results will be
      [
        {
            result: {response},
            state: 'resolved'
        },
        {
            result: {FetchError},
            state: 'rejected'
        },
        {
            result: {response},
            state: 'resolved'
        },
      ]
  })
```
