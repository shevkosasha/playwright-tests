import { test, expect } from '@playwright/test';

test('check navigation header is present', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  //check navigation is visible
  await expect.soft(page.getByRole('link', { name: 'Playwright logo Playwright' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'MCP', exact: true })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'CLI', exact: true })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'API' })).toBeVisible()
  await expect.soft(page.getByRole('button', { name: 'Node.js' })).toBeVisible();
  await expect.soft(page.getByText('Node.jsNode.jsPythonJava.NET')).toBeVisible();


  await expect.soft(page.getByRole('link', { name: 'GitHub repository' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Discord server' })).toBeVisible();
  await expect.soft(page.getByRole('button', { name: 'Switch between dark and light' })).toBeVisible();
  await expect.soft(page.getByRole('button', { name: 'Search (Control+k)' })).toBeVisible();
});

test('check navigation header contains correct text', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // check navigation contains required text
  await expect(page.getByRole('navigation', { name: 'Main' }).locator('b')).toContainText('Playwright');
  await expect(page.getByRole('link', { name: 'Docs' })).toContainText('Docs');
  await expect(page.getByRole('link', { name: 'MCP', exact: true })).toContainText('MCP');
  await expect(page.getByRole('link', { name: 'CLI', exact: true })).toContainText('CLI');
  await expect(page.getByRole('link', { name: 'API' })).toContainText('API');
  await expect(page.getByRole('button', { name: 'Node.js' })).toContainText('Node.js');
});

test('check navigation hrefs', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // check navigation contains required text
  await expect(page.getByRole('link', { name: 'Playwright logo Playwright' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs/intro');
  await expect(page.getByRole('link', { name: 'MCP', exact: true })).toHaveAttribute('href', '/mcp/introduction');
  await expect(page.getByRole('link', { name: 'CLI', exact: true })).toHaveAttribute('href', '/agent-cli/introduction');
  await expect(page.getByRole('link', { name: 'API' })).toHaveAttribute('href', '/docs/api/class-playwright');
   
  await expect(page.getByRole('link', { name: 'GitHub repository' })).toHaveAttribute('href', 'https://github.com/microsoft/playwright');
  await expect(page.getByRole('link', { name: 'Discord server' })).toHaveAttribute('href', 'https://aka.ms/playwright/discord');
});

test('check light mode selection', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('button', { name: 'Switch between dark and light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', { name: 'Switch between dark and light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: 'Switch between dark and light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  // await page.getByRole('button', { name: 'Switch between dark and light' }).click();
  // await page.getByRole('button', { name: 'Switch between dark and light' }).click();
  // await page.getByRole('button', { name: 'Switch between dark and light' }).click();
});

test('check title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.getByRole('heading', { name: 'Playwright enables reliable' })).toBeVisible();
  await page.getByRole('heading', { name: 'Playwright enables reliable' }).click();
});

test('check get started button', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect.soft(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Get started' })).toContainText('Get started');
  await expect.soft(page.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/docs/intro');

  // await page.getByRole('link', { name: 'Get started' }).click();
});