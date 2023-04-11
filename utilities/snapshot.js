const puppeteer = require('puppeteer');

const convertToBase64 = (buffer) => {
  return Buffer.from(buffer, 'binary').toString('base64');
};

exports.createSnapshot = async ({ url }) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ['--incognito', '--no-sandbox', '--single-process', '--no-zygote'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: './uploads/example.png' });
    const imageBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 100,
      clip: {
        x: 0,
        y: 0,
        width: 640,
        height: 360,
      },
      omitBackground: true,
    });

    const snapshotImg = convertToBase64(imageBuffer);

    // console.log('imageBuffer', imageBuffer);

    let pageDescription;
    let pageTitle;
    let pageImage;

    try {
      pageDescription = await page.evaluate(() =>
        document.head
          .querySelector('meta[property="og:description"]')
          .getAttribute('content')
      );
      pageTitle = await page.evaluate(() =>
        document.head
          .querySelector('meta[property="og:title"]')
          .getAttribute('content')
      );
      pageImage = await page.evaluate(() =>
        document.head
          .querySelector('meta[property="og:image"]')
          .getAttribute('content')
      );
      const pageInfo = {
        pageTitle,
        pageDescription,
        pageImage,
      };
      await browser.close();
      return { success: true, ...pageInfo };
    } catch (error) {
      await browser.close();
      const pageInfo = {
        pageTitle: null,
        pageDescription: null,
        pageImage: null,
      };
      console.log('err1');
      return { success: true, ...pageInfo };
    }
  } catch (error) {
    console.log('err2');

    return {
      success: false,
      message: 'Screenshot failed',
    };
  }
};
