const puppeteer = require('puppeteer');

exports.createSnapshot = async({ url }) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({path: './uploads/example.png'});
  
    await browser.close();
    return { success: true }
  } catch(error) {
    return {
      success: false,
      message: "Screenshot failed"
    }
  }
}