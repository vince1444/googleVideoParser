const { searchForTags } = require('./videoParser.js');
//const { clear, write } = require('../firebase/firebase.js');
const { listen } = require('./express.js');
const { performance } = require('perf_hooks');

//user tags
const tags = [];




async function run() {
    //listen();
    const maxPage = 1;
    
    let results = await searchForTags(tags, maxPage, 10);
    results.forEach(e => {
        console.log(e);
    })
}
run();