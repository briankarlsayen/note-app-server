const puppeteer = require('puppeteer');
const { uploadStream } = require('./uploadImg');
const { isURL, limitStringLen } = require('./tools');
const axios = require('axios');

// * echancements
/*
  [ ] - set other opts for searching header title, description and image
*/

exports.createSnapshot = async ({ url }) => {
  try {
    const BASE_URL =
      'https://pw-web-scrape-git-master-briankarlsayen.vercel.app/screenshot';
    const params = {
      url,
      width: 640,
      height: 360,
    };

    const response = await axios.post(BASE_URL, params);
    if (!response.data) throw new Error();
    const responseData = response?.data;
    const pageTitle = responseData.title ?? null;
    const pageDescription = responseData.description ?? null;

    let snapshotImg;
    // * create a snapshot image then save it on cloud storage
    if (responseData.isScreenshot) {
      const imageBuffer = responseData.image;
      snapshotImg = await uploadStream(imageBuffer);
    }

    const pageInfo = {
      pageTitle: limitStringLen(pageTitle),
      pageDescription: limitStringLen(pageDescription),
      pageImage: responseData?.isScreenshot ? snapshotImg : responseData?.image,
    };

    return { success: true, ...pageInfo };
  } catch (error) {
    const pageInfo = {
      pageTitle: null,
      pageDescription: null,
      pageImage: null,
    };
    console.log('err1', error);
    return { success: true, ...pageInfo };
  }
};
