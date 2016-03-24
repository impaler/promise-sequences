const topstories = 'https://hacker-news.firebaseio.com/v0/topstories.json'

if(window)
    window.document.addEventListener('DOMContentLoaded', init)
else if(module && module.exports) {
    module.exports = init
}

// https://github.com/HackerNews/API
//     "by" : "dhouston",
//     "descendants" : 71,
//     "id" : 8863,
//     "kids" : [ 8952, 9224, 8917, 8884, 8887, 8943, 8869, 8958, 9005, 9671, 8940, 9067, 8908, 9055, 8865, 8881, 8872, 8873, 8955, 10403, 8903, 8928, 9125, 8998, 8901, 8902, 8907, 8894, 8878, 8870, 8980, 8934, 8876 ],
//     "score" : 111,
//     "time" : 1175714200,
//     "title" : "My YC app: Dropbox - Throw away your USB drive",
//     "type" : "story",
//     "url" : "http://www.getdropbox.com/u/2/screencast.html"

function getStory(id) {
    return `https://hacker-news.firebaseio.com/v0/item/${id}.json`
}


function init() {
    createFetch(topstories)
        .then(results=> {
            var tasks = []
            for (result in results) {
                tasks.push(createFetch(getStory(results[result])))
            }
            return series(tasks, 20, step)
        })
        .then(results=> {
            for (result in results) {
                log(results[result].title)
            }
        })
        .catch(error=> {
            log(error)
        })
}

function step(results, currentStep, totalSteps) {
    log(`Done ${currentStep} of ${totalSteps}`)
}

function createFetch(url) {
    return new Promise((resolve, reject)=> {
        return fetch(url)
            .then(status)
            .then(json)
            .then(function (data) {
                resolve(data)
            })
            .catch(function (error) {
                reject(error)
            });
    });
}

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

function json(response) {
    return response.json()
}

function log(message) {
    var timeMessage = `${new Date().getTime()} : ${message}`

    console.log(timeMessage)

    window.document.body.appendChild(
        window.document.createElement('hr')
    )

    window.document.body.appendChild(
        window.document.createTextNode(timeMessage)
    )

    window.scrollTo(0,document.body.scrollHeight);
}