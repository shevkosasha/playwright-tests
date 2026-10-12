import { test } from '../fixtures/MainPage';

const MODES = ['light', 'dark'];

test.describe('Main Page tests', () => {
   
  // test.beforeEach(async ({ page }) => {
  //   mainPage = new MainPage(page);
  //   await mainPage.open();
  // });

  test('check all elements are visible', async ({ mainPage }) => {
    await mainPage.checkElementsVisibility();
  });

  test('check navigation header contains correct text', async ({ mainPage }) => {
    await mainPage.checkElementsText();
  });

  test('check navigation attributes', async ({ mainPage }) => {
    await mainPage.checkNavAttributes();
  });

  test('check light mode selection', async ({ mainPage }) => {
    await mainPage.toggleLightMode();
    await mainPage.checkAttribute('html', 'data-theme', 'light')

    await mainPage.toggleLightMode();
    await mainPage.checkAttribute('html', 'data-theme', 'dark')

    await mainPage.toggleLightMode();
    await mainPage.checkAttribute('html', 'data-theme', 'light')
  });

 MODES.forEach((value) => {
    test(`check ${value} mode`, async ({ mainPage }) => {
      await mainPage.setLightMode(value);
      await mainPage.checkLightModeScreenshot(value);
    });
  });

  test('check title', async ({ mainPage }) => {
    await mainPage.checkTitle();
  });

  test('check get started button', async ({ mainPage }) => {
    await mainPage.checkGetStartedBtn();
  });
});