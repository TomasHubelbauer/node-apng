const puppeteer = require('puppeteer');

process.on('unhandledRejection', error => { throw error; });

void async function () {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const [page] = await browser.pages();
    await page.goto('https://www.youtube.com/watch?v=jNQXAC9IVRw');
    const playButton = await page.waitForSelector('.ytp-large-play-button');
    await playButton.click();
    for (let index = 0; index < 3; index++) {
      await page.waitFor(1000);
      await page.screenshot({ path: `../../test/large/frame${index + 1}.png` });
    }
  }
  finally {
    await browser.close();
  }
}()
