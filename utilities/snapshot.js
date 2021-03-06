const puppeteer = require('puppeteer');

exports.createSnapshot = async({ url }) => {
  try {
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
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'domcontentloaded'});
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
  } catch(error) {
    return {
      success: false,
      message: "Screenshot failed"
    }
  }
}