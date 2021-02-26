const { searchForTags, display, x } = require('./videoParser.js');
const { clear, write } = require('./firebase.js');
const { performance } = require('perf_hooks');
//user tags
const tags = [''];
function cleanResults(results) {
    let obj = {
        date: new Date(),
        videos: []
    }
    for (let i = 0; i < results.length; i++) {
        if (results[i] === null) {
            results.splice(i, (results.length - i));
            break;
        }
        
        obj.videos.push(results[i]);
    }
    return obj;
}

async function run() {
    let duration;
    let length;
    let occurrences;
    const maxPage = 13;
    let results = await searchForTags(tags, maxPage);
    const t0 = performance.now();
    results.forEach(e => {
        if (!(e === null)) {
            e.videos.forEach(e => {
                duration = e.duration;
                if (!(duration === null  || duration == 0)) {
                    length = duration.length;
                    //if first value is falsey, occurences == []
                    occurrences = (duration.match(/:/g) || []).length;
                    //mm:ss or m:ss
                    if (occurrences == 1) {
                        if (length == 4) {
                            if (duration[0] > 5) {
                                console.log(e);
                            }
                        }
                        else { console.log(e); }
                    }
                    //hh:mm:ss
                    if (occurrences == 2) {
                        console.log(e);
                    }
                }
            })
        }
    })
    const t1 = performance.now();
    console.log(t1 - t0);
}
run();