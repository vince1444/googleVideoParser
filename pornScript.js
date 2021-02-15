//imports
const axios = require('axios');


//tags you're searching for
const tags = ['jav', 'woman'];

//search function to pull data from google
async function searchForTags(tags, maxPage) {
    const results = [];
    let result;
    let searchString;
    for (let i = 20; i < maxPage + 1; i++) {
        searchString = createUrl(tags, i);
        result = axios.get(searchString).then(res => {
            const data = res.data;
            return cleanData(data);
        }).catch(e => console.log(e));
        results.push(result);
    }
    return Promise.all(results);
}

function createUrl(tags, page) {
    //10 items per page, first page = 0
    //param = start=10(for second page)
    page = (page - 1) * 10;
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
                         'https:)?', 'https://support.google.com/'];
    const firstLook = 'var a=document.getElementById("st-toggle")';
    const linkLook = 'http';
    const str = raw.substring(raw.indexOf(firstLook));
    const indices = findIndices(linkLook, str);
    let fnRtn;
    let str1;
    for (let i = 0; i < indices.length; i++) {
        str1 = str.substring(indices[i], indices[i + 1]);
        if (bannedLinks.some(ele => { return str1.includes(ele) })) continue;
        fnRtn = cleanString(str1, linkLook);
        links.push(fnRtn);
    }
    if (typeof links !== undefined) return links;
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
        //at 20th pos, google documentation links so ignore those
        if (c == 20) break;
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

//run program
async function run() {
    const maxPage = 30;
    console.log(`Total pages searching for ${tags}: ${maxPage}`);
    let results = await searchForTags(tags, maxPage);
    results.forEach(e => {
        if (e.length !== 0) console.log(e);
    })
}
run();