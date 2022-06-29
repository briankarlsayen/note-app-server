const puppeteer = require('puppeteer');

exports.createSnapshot = async({ url }) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: './uploads/example.png'});
    let pageDescription;
    let pageTitle;
    let pageImage;

    try {
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
    return {
      success: false,
      message: "Screenshot failed"
    }
  }
}