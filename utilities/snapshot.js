const puppeteer = require('puppeteer');
const { uploadStream } = require('./uploadImg');
const { isURL, limitStringLen } = require('./tools');

// * echancements
/*
  [ ] - set other opts for searching header title, description and image
*/
exports.createSnapshot = async ({ url }) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ['--incognito', '--no-sandbox', '--single-process', '--no-zygote'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    try {
      let [pageDescription, pageTitle, pageImage] = await page.evaluate(
        async () => {
          const titleNode = document.head
            ?.querySelector('meta[property="og:title"]')
            ?.getAttribute('content');

          const imgNode = document.head
            ?.querySelector('meta[property="og:image"]')
            ?.getAttribute('content');

          const descNode = document.head
            ?.querySelector('meta[property="og:description"]')
            ?.getAttribute('content');
          return [descNode, titleNode, imgNode];
        }
      );

      let snapshotImg;
      // * create a snapshot image then save it on cloud storage
      const checkIsValidImg = isURL(pageImage);
      if (!checkIsValidImg) {
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
        snapshotImg = await uploadStream(imageBuffer);
      }

      const pageInfo = {
        pageTitle: limitStringLen(pageTitle),
        pageDescription: limitStringLen(pageDescription),
        pageImage: checkIsValidImg ? pageImage : snapshotImg,
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
