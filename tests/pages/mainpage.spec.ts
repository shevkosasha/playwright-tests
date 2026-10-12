import { test, expect, Page, Locator } from '@playwright/test';
import { MainPage } from '../models/MainPage';

const MODES = ['light', 'dark'];

let mainPage: MainPage;

test.describe('Main Page tests', () => {
   
  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.open();
  });

  test('check all elements are visible', async ({ page }) => {
    await mainPage.checkElementsVisibility();
  });

  test('check navigation header contains correct text', async ({ page }) => {
    await mainPage.checkElementsText();
  });

  test('check navigation attributes', async ({ page }) => {
    await mainPage.checkNavAttributes();
  });

  test('check light mode selection', async ({ page }) => {
    await mainPage.toggleAndCheckLightMode('light');
    await mainPage.toggleAndCheckLightMode('dark');
    await mainPage.toggleAndCheckLightMode('light');
  });

 MODES.forEach((value) => {
    test(`check ${value} mode`, async ({ page }) => {
      await mainPage.setLightMode(value);
      await mainPage.checkLightModeScreenshot(value);
    });
  });

  test('check title', async ({ page }) => {
    await mainPage.checkTitle();
  });

  test('check get started button', async ({ page }) => {
    await mainPage.checkGetStartedBtn();
  });
});