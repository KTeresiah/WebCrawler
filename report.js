//print the reports beautfifully
function printReport(pages){
    console.log("============")
    console.log("REPORT")
    console.log("============")
    //get the sorted pages
    const sortedPages = sortPages(pages)
    for(const sortedpage of sortedPages){
        //since its an array where url is at index 0
        const url = sortedpage[0]
        const hits = sortedPages[1]
        console.log(`Found ${hits} links to page: ${url}`)

    }
    console.log("============")
    console.log("END REPORT")
    console.log("============")


}


//function that sort pages and returns an array
function sortPages(pages){
    //convert pages to array this creates the needed array in array
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a,b) => {
        aHits = a[1]
        bHits = b[1]
        //sort greatest to least
        return b[1] - a[1]
    })
    return pagesArr
}
module.exports = {
    sortPages,
    printReport
}