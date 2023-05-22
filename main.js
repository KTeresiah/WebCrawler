const {crawlPage} = require('./crawl.js')
function main(){
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
    crawlPage(baseURL)
}
main()