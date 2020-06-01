const puppeteer = require('puppeteer');
const cheerio=require('cheerio')
const fs=require('fs')

var objectData=[]

var scrapePage=async(HTML)=>{
    
    const $=cheerio.load(HTML);

    var tableHTML=$('table.medium.css-yrgpw8.svelte-nim44h.compact.resortable.desktop-only').html().toString()
    
        var headers=[]
        for(var i=0;i<9;i++){
            headers.push($('table>thead>tr>th').eq(i).text())
        }
        console.log("Heading Done")
        
        console.log($('table>tbody>tr>td.type-text').length)

        for(var i=0;i<$('table>tbody>tr>td.type-text').length;){
                var childObj=new Object()
                for(var j=0;j<headers.length;j++){
                    childObj[headers[j]]=$('table>tbody>tr>td.type-text').eq(i+j).text()

                }
                objectData.push(childObj)

                i=i+32;
            }
        
            
}
        
        


 
 
(async () => {
  const browser = await puppeteer.launch({headless:false,slowMo:200});
  const page = await browser.newPage();
  
  await page.setDefaultNavigationTimeout(0);
  const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});
  
  await page.goto('https://datawrapper.dwcdn.net/H7PJn/40/', {waitUntil: 'networkidle2'});

  
  await page.setViewport({ width: 1303, height: 697 })

  var times=0;

  while(times<=113){
    
    await page.waitForSelector('#chart > .above-table > .pagination > .next > .svelte-1yl7n8i',{timeout:0})
    
    console.log("here!!")
    
    
    let fullHTML=await page.content();

    await scrapePage(fullHTML);


    times++;
    
    await page.click('#chart > .above-table > .pagination > .next > .svelte-1yl7n8i')


    
    fs.writeFileSync('./data.json',JSON.stringify(objectData))    
    console.log("New length: ",objectData.length)


  }

  fs.writeFileSync('./data.json',JSON.stringify(objectData))    
    
  await console.log(objectData)
  
  
  
  await browser.close();
})();

