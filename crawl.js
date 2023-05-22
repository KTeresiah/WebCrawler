const {JSDOM} = require('jsdom')

async function crawlPage(currentURL){
    console.log(`actively crawling: ${currentURL}`)
    //Get request to the URL
    try{
        const resp = await fetch(currentURL)
        if (resp.status > 399){
            console.log(`Error in fetch with status code; ${resp.status} on page ${currentURL}`)
            return
        }
        //grab content type header to make sure we are getting the right content type
        const contentType = resp.headers.get("content-type")
        if(!contentType.includes("text/html")){
            console.log(`non html response, content type: ${contentType} on page ${currentURL}`)
            return
        }
        console.log(await resp.text()) // since it will be parsed as html
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