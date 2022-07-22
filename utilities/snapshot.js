const puppeteer = require('puppeteer');

exports.createSnapshot = async({ url }) => {
  console.log('url', url)
  console.log('0')
  try {
    console.log('1')
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: [
          "--incognito",
          "--no-sandbox",
          "--single-process",
          "--no-zygote"
      ],
    });
    console.log('2')
    const page = await browser.newPage();
    console.log('3')
    await page.goto(url, {waitUntil: 'domcontentloaded'});
    console.log('4')
    await page.screenshot({path: './uploads/example.png'});
    let pageDescription;
    let pageTitle;
    let pageImage;

    try {
      console.log('5')
      pageDescription = await page.evaluate(() => document.head.querySelector('meta[property="og:description"]').getAttribute("content"));
      pageTitle = await page.evaluate(() => document.head.querySelector('meta[property="og:title"]').getAttribute("content"));
      pageImage = await page.evaluate(() => document.head.querySelector('meta[property="og:image"]').getAttribute("content"));

      const pageInfo = {
        pageTitle,
        pageDescription,
        pageImage,
      }
      await browser.close();
      return { success: true, ...pageInfo }

    } catch(error) {
      console.log('6')
      await browser.close();
      const pageInfo = {
        pageTitle: null,
        pageDescription: null,
        pageImage: null,
      }
      return { success: true, ...pageInfo }
    }

    // if(!pageImage) await page.screenshot({ path: './uploads/example.png' });


    // await page.evaluate(() => document.head.querySelector('meta[property="og:description"]').getAttribute("content"))
    // .then(result => pageDescription = result)
    // .error(err => pageDescription = null)

    // await page.evaluate(() => document.head.querySelector('meta[property="og:title"]').getAttribute("content"))
    // .then(result => pageTitle = result)
    // .error(err => pageTitle = null)
    
    // await page.evaluate(() => document.head.querySelector('meta[property="og:image"]').getAttribute("content"))
    // .then(result => pageImage = result)
    // .error(err => pageImage = null)
    // console.log(pageDescription)
    
    
  } catch(error) {
    console.log('7')
    return {
      success: false,
      message: "Screenshot failed"
    }
  }
}