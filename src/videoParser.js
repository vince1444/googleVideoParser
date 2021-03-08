//imports
const axios = require('axios');

//search function to pull data from google
async function searchForTags(tags, maxPage, minDuration, maxDuration) {
    minDuration = minDuration || 0; //0 is arbitrary
    maxDuration = maxDuration || 10000; //10000 is abitrary
    const results = [];
    let result;
    let searchString;
    let fnRtn;
    console.log(`Input tags: ${tags}...Going through ${maxPage} pages...`);
    for (let i = 0; i < maxPage; i++) {
        searchString = createUrl(tags, i);
        console.log(searchString);
        result = axios.get(searchString).then(res => {
            const data = res.data;
            //fnRtn = cleanData(data);
            fnRtn = filter(cleanData(data), minDuration, maxDuration);
            if (fnRtn.length !== 0) {
                return fnRtn;
            }
        }).catch(e => console.log(e));
        results.push(result);
    }
    return Promise.all(results);
}

function createUrl(tags, page) {
    //10 items per page, first page = 0
    //param = start=10(for second page)
    page = page * 10;
    let searchString = 'https://www.google.com/search?q='
    tags.forEach(element => {
        if (tags.indexOf(element) == 0) {
            searchString += `${element}`;
        }
        else { searchString += `+${element}` }
    })
    return `${searchString}&source=lnms&tbm=vid&start=${page}`;
}

function cleanData(raw) {
    const links = [];
    const bannedLinks = ['https://lumendatabase.org/', 'https://www.google.com/', 'https://policies.google.com/', 
                         'https:)?', 'https://support.google.com/', 'https://www.youtube.com/', 'facebook.com'];
    const firstSearch = 'var a=document.getElementById("st-toggle")';
    const linkSearch = 'http';
    const str = raw.substring(raw.indexOf(firstSearch));
    const indices = findIndices(linkSearch, str);
    let str1;
    for (let i = 0; i < indices.length; i++) {
        str1 = str.substring(indices[i], indices[i + 1]);
        if (bannedLinks.some(e => { return str1.includes(e) })) continue;
        links.push({
            "link": cleanString(str1, linkSearch),
            "duration": findDuration(str1)
        });
    }
    return links;
}

function findDuration(str) {
    //duration + 10 gives just the number
    if (str.includes('Duration:')) {
        return str.substring(str.indexOf('Duration:') + 10, str.indexOf('\n'));
    }
    else { return 'No duration found.' }
}

function findIndices(subStr, fullStr) {
    const indices = [];
    let i = -1;
    let c = 0;
    while ((i = fullStr.indexOf(subStr, i + 1)) >= 0) {
        //each page has 25 links, each link posted twice in succession
        //example: 
        //link.com
        //link.com
        //link1.com...etc
        //at 21st pos, google documentation links so ignore those
        if (c > 20) break;
        if (c % 2 == 0) {
            indices.push(i);
        }
        c++;
    }
    return indices; 
}

//logic to get string for cleanedData
function cleanString(str, search) {
    return str.substring(str.indexOf(search), str.indexOf('&'));
}

function filter(array, minLength, maxLength) {
    let duration;
    let length;
    let occurrences;
    const videos = [];
    
    array.forEach(e => {
        duration = e.duration;
        if (!(duration === null || duration === undefined || duration == 0 || duration === 'No duration found.')) {
            length = duration.length;
            //if first value is falsey, occurences == []
            occurrences = (duration.match(/:/g) || []).length;
            //mm:ss or m:ss
            if (occurrences == 1) {
                if (length == 4) {
                    if (duration[0] >= minLength ) videos.push(e);
                }
                if (length == 5) {
                    if ((duration[0] + duration[1]) >= minLength) videos.push(e);
                }
            }
            //hh:mm:ss
            //if it's over an hour just push; need to add hour checking later
            if (occurrences == 2) videos.push(e);
        }
    })
    return videos;
}

module.exports = {
    searchForTags
}


