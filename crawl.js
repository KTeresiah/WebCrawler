const {JSDOM} = require('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    //make sure you don't crawl the entire internet
    if (baseURLObj.hostname !== currentURLObj.hostname){
        return pages
    }
    //check if we have already crawled through the page
    const normalizedCurrentURL = normalizeURL(currentURL)
    //if I have already seen this page increment and return pages
    if(pages[normalizedCurrentURL] > 0){
        pages[normalizedCurrentURL]++
        return pages
    }
    //entry to normalized URL
    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`)
    //Get request to the URL
    try{
        const resp = await fetch(currentURL)
        if (resp.status > 399){
            console.log(`Error in fetch with status code; ${resp.status} on page ${currentURL}`)
            return pages
        }
        //grab content type header to make sure we are getting the right content type
        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType} on page ${currentURL}`)
            return pages
        }
        const htmlBody = await resp.text() // since it will be parsed as html

        //extract links from the  HTML so we have more links to crawl
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)
        //iterate over next URL
        for (const nextURL of nextURLs){
            //crawl recursively
            pages = await crawlPage(baseURL, nextURL, pages)

        }
        //when we've crawled everything return the pages object
        return pages
    } catch (err) {
        console.log(`Error in fetch with status code; ${err.message} on page ${currentURL}`)
    }

}

function getURLsFromHTML(htmlBody,baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){
        //console.log(linkElement.href)
        if(linkElement.href.slice(0, 1) === '/'){
            //relative
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`) 
            urls.push(urlObj.href)

            } catch(err){
                console.log(`error with relative url: ${err.message}`)
            }
            
        }
        else{
            //absolute url
            try{
                const urlObj = new URL(linkElement.href) 
                urls.push(urlObj.href)

            } catch(err){
                console.log(`error with absolute url: ${err.message}`)
            }
        }
        
    }
    return urls

}
function normalizeURL(urlString){
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1)
    }
    return hostPath
}
module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}