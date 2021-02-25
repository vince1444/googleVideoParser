const { searchForTags, display } = require('./videoParser.js');
const { clear, write } = require('./firebase.js');

//user tags
const tags = [];
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
    const maxPage = 10;
    let results = await searchForTags(tags, maxPage);
    let data = cleanResults(results);
    write(data);
}
run();