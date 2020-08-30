//tuitions are always 1 year based

/* JSON STRUCTURE
Name is always in the format: university - course
university - general is the default value in case it's applied for all courses
{
  "cities": [
    {
      "name": "Vancouver",
      "values": [
        {
          "name": "XXX",
          "amount": 000000.00
        },
      ]
    },
  ]
} */

//https://www.centennialcollege.ca/admissions/tuition-and-fees/tuition-information/ OK
//https://www.fanshawec.ca/paying-college/tuition-fees/tuition-fees
//https://futurestudents.yorku.ca/tuition

const puppeteer = require('puppeteer')

const scrapeCentennial = async () => {
  //const browser = await puppeteer.launch()
  const browser = await puppeteer.launch({args: ['--no-sandbox'] });

  const page = await browser.newPage()
  const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
  const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
  await page.setUserAgent(chromeUserAgent);
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.8'
  });

  await page.goto(
    'https://www.centennialcollege.ca/admissions/tuition-and-fees/tuition-information/', {waitUntil: 'networkidle0'}
  )
  page.on("console", msg => console.log("PAGE LOG:", msg)); 

  const scrapedData = await page.evaluate(() =>{
    const result = []
    result.push(
      {
        name: "Centennial College",
        course: "Post-secondary Programs",
        amount: document.querySelector('.subpage_main > .responsive-tbl-cont:nth-child(12) > .tbl-row-cont > .tbl-row:nth-child(1) > .data').textContent
      }
    )

    result.push(
      {
        name: "Centennial College",
        course: "School of Engineering Technology and Applied Science & School of Transportation Post-secondary Programs",
        amount: document.querySelector('.subpage_main > .responsive-tbl-cont:nth-child(15) > .tbl-row-cont > .tbl-row:nth-child(1) > .data').textContent
      }
    )

    result.push(
      {
        name: "Centennial College",
        course: "Applied Information Technology (Computer and Communication Networks) Honours Degree Program",
        amount: document.querySelector('.subpage_main > .responsive-tbl-cont:nth-child(20) > .tbl-row-cont > .tbl-row:nth-child(1) > .data').textContent
      }
    )

    result.push(
      {
        name: "Centennial College",
        course: "Public Relations Management Honours Degree Program",
        amount: document.querySelector('.subpage_main > .responsive-tbl-cont:nth-child(25) > .tbl-row-cont > .tbl-row:nth-child(1) > .data').textContent
      }
    )

    result.push(
      {
        name: "Centennial College",
        course: "Bachelor of Science in Nursing (BScN)",
        amount: document.querySelector('.subpage_main > .responsive-tbl-cont:nth-child(30) > .tbl-row-cont > .tbl-row:nth-child(1) > .data').textContent
      }
    )

    return result
  })

  await browser.close()
  return scrapedData
}

const scrapeFanshawec = async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox'] });

  const page = await browser.newPage()
  const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
  const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
  await page.setUserAgent(chromeUserAgent);
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.8'
  });

  await page.goto(
    'https://www.fanshawec.ca/paying-college/tuition-fees/tuition-fees', {waitUntil: 'networkidle0'}
  )
  page.on("console", msg => console.log("PAGE LOG:", msg)); 

  const scrapedData = await page.evaluate(() =>{
    const result = []
    result.push(
      {
        name: "Fanshawe College",
        course: "International Students - general",
        amount: '$'+document.querySelector('.layout > .layout__region > .block > .clearfix > .highlight-box:nth-child(9)').textContent.split('$')[1].split(' ')[0]
      }
    )

    return result
  })

  await browser.close()
  return scrapedData
}

const scrapeYork = async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox'] });

  const page = await browser.newPage()
  const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
  const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
  await page.setUserAgent(chromeUserAgent);
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.8'
  });

  await page.goto(
    'https://futurestudents.yorku.ca/tuition', {waitUntil: 'networkidle0'}
  )
  page.on("console", msg => console.log("PAGE LOG:", msg)); 

  const scrapedData = await page.evaluate(() =>{
    const result = []
    const uniValues = document.querySelector('div > table > tbody > tr:nth-child(1) > td:nth-child(3)').textContent.split('\n')
    uniValues.forEach(function(entry) {
      let splitContent = entry.split(' - ')
      result.push(
        {
          name: "York University",
          course: splitContent[1],
          amount: splitContent[0].replace(/\t/g, '')
        }
      )
    })

    return result
  })

  await browser.close()
  return scrapedData
}

module.exports.scrapeCentennial = scrapeCentennial
module.exports.scrapeFanshawec = scrapeFanshawec
module.exports.scrapeYork = scrapeYork