const {crawlPage} = require('./crawl.js')
const {printReport} = require('./report.js')

async function main(){
    if(process.argv.length <3)
    {
        console.log("no website provided")
        console.log(process.argv.length)
        process.exit(1)
        
    }
    if(process.argv.length  > 3)
    {
        console.log("too many command line args")
        console.log(process.argv.length)
        process.exit(1)
        
    }
    const baseURL = process.argv[2]
    //why we are checking for length 3
    for(const arg of process.argv){
        console.log(arg)

    }
    console.log(`starting crawl of ${baseURL}`)
    console.log(process.argv.length)
    //pages is an object not an array hence Object.entries
    const pages = await crawlPage(baseURL, baseURL, {})

    /*for (const page of Object.entries(pages)){
        console.log(pages)
    }*/
    printReport(pages)
}
main()