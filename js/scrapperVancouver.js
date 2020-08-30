//tuitions are always 1 year based

/* JSON STRUCTURE
university - general is the default value in case it's applied for all courses
{
  "cities": [
    {
      "name": "Vancouver",
      "values": [
        {
          "name": "XXX",
          "course": "XXX",
          "amount": 000000.00
        },
      ]
    },
  ]
} */

//https://www.capilanou.ca/admissions/fees--finances/tuition--fees/tuition--fee-estimator/ 
//https://www.douglascollege.ca/international-students/prospective-students/tuition-and-fees 
//https://students.ubc.ca/enrolment/finances/tuition-fees/undergraduate-tuition-fees 

const puppeteer = require('puppeteer')

const scrapeCapilano = async () => {
  //parameter to make it work on heroku VM
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const scrapedData = []

  const page = await browser.newPage()
  //header to make headless mode works exactly as regular browser
  const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
  const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
  await page.setUserAgent(chromeUserAgent);
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.8'
  });

  await page.goto(
    'https://www.capilanou.ca/admissions/fees--finances/tuition--fees/tuition--fee-estimator/', { waitUntil: 'networkidle0' }
  )
  //settings for debugging
  page.on("console", msg => console.log("PAGE LOG:", msg));

  const courseList = await page.evaluate(() => {
    const select = document.querySelector('select[name=code]')
    const values = Array.from(select).map(el => el.value)
    return values
  })

  for (const entry of courseList) {
    if (entry != '') {
      const navigationPromise = page.waitForNavigation()
      await page.waitForSelector('.page-alert > .form-group:nth-child(2) > .select-wrap > .select-container > select')
      await page.click('.page-alert > .form-group:nth-child(2) > .select-wrap > .select-container > select')

      await page.select('.page-alert > .form-group:nth-child(2) > .select-wrap > .select-container > select', entry)

      await page.waitForSelector('.page-alert > .form-group:nth-child(2) > .select-wrap > .select-container > select')
      await page.click('.page-alert > .form-group:nth-child(2) > .select-wrap > .select-container > select')

      await page.waitForSelector('.page-alert > .form-group:nth-child(3) > .select-wrap > .select-container > select')
      await page.click('.page-alert > .form-group:nth-child(3) > .select-wrap > .select-container > select')

      await page.select('.page-alert > .form-group:nth-child(3) > .select-wrap > .select-container > select', 'International')

      await page.waitForSelector('.page-alert > .form-group:nth-child(3) > .select-wrap > .select-container > select')
      await page.click('.page-alert > .form-group:nth-child(3) > .select-wrap > .select-container > select')

      await page.waitForSelector('.main-content #submit')
      await page.click('.main-content #submit')

      await navigationPromise
      await page.waitForSelector('div:nth-child(5) > div > .responsive-table > table > tbody > tr:nth-child(2) > td:nth-child(2)')

      const course = await page.evaluate(() => {
        const result = []
        console.log(document.querySelector('select[name=code]'))
        result.push(
          {
            name: "Capilano University",
            course: document.querySelector('select[name=code]').selectedOptions[0].text,
            amount: document.querySelector('div:nth-child(5) > div > .responsive-table > table > tbody > tr:nth-child(2) > td:nth-child(2)').textContent
          }
        )
        return result
      })
      scrapedData.push(course)
    }
  }

  await browser.close()
  return scrapedData
}

const scrapeDouglas = async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });

  const page = await browser.newPage()
  const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
  const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
  await page.setUserAgent(chromeUserAgent);
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.8'
  });

  await page.goto(
    'https://www.douglascollege.ca/international-students/prospective-students/tuition-and-fees', { waitUntil: 'networkidle0' }
  )
  page.on("console", msg => console.log("PAGE LOG:", msg));

  const scrapedData = await page.evaluate(() => {
    const result = []

    result.push(
      {
        name: "Douglas College",
        course: 'International students - general',
        amount: '$' + document.querySelector('.node > .row > .col-12 > .clearfix > p:nth-child(3)').textContent.split('$')[2].split(/(\s+)/)[0]
      }
    )

    return result
  })

  await browser.close()
  return scrapedData
}

const scrapeUBC = async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });

  const page = await browser.newPage()
  const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
  const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
  await page.setUserAgent(chromeUserAgent);
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.8'
  });

  await page.goto(
    'https://students.ubc.ca/enrolment/finances/tuition-fees/undergraduate-tuition-fees ', { waitUntil: 'networkidle0' }
  )
  page.on("console", msg => console.log("PAGE LOG:", msg));

  const scrapedData = await page.evaluate(() => {
    const result = []
    const table = document.querySelector('#block-system-main > div > div.group-content.container.row-fluid > div.group-left.span7 > section:nth-child(2) > article.ds-1col.node.node-cp-text.node-even.view-mode-default.clearfix > table');
    for (var i = 0, row; row = table.rows[i]; i++) {
      if (i > 2) {
        result.push(
          {
            name: "University of British Columbia",
            course: row.cells[0].textContent.replace(/\t/g, '').replace(/\n/g, ''),
            amount: row.cells[3].textContent.replace(/\t/g, '').replace(/\n/g, '')
          }
        )
      }
    }

    return result
  })

  await browser.close()
  return scrapedData
}

module.exports.scrapeCapilano = scrapeCapilano
module.exports.scrapeDouglas = scrapeDouglas
module.exports.scrapeUBC = scrapeUBC