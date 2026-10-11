import { test, expect, Page, Locator } from '@playwright/test';

// Апісваем інтэрфейс для элементра праекта
interface ElementData {
  name: string;
  locator: (page: Page) => Locator;
  expectedText?: string;
  expectedHref?: string;
}

const elements: ElementData[] = [
  {
    name: "Playwright logo",
    locator: (page) => page.getByRole('link', { name: 'Playwright logo Playwright' }),
    expectedHref: '/'
  },
  {
    name: "Docs link",
    locator: (page) => page.getByRole('link', { name: 'Docs' }),
    expectedText: 'Docs',
    expectedHref: '/docs/intro'
  },
  {
    name: "MCP link",
    locator: (page) => page.getByRole('link', { name: 'MCP', exact: true }),
    expectedText: 'MCP',
    expectedHref: '/mcp/introduction'
  },
  {
    name: "CLI link",
    locator: (page) => page.getByRole('link', { name: 'CLI', exact: true }),
    expectedText: 'CLI',
    expectedHref: '/agent-cli/introduction'
  },
  {
    name: "API link",
    locator: (page) => page.getByRole('link', { name: 'API' }),
    expectedText: 'API',
    expectedHref: '/docs/api/class-playwright'
  },
  {
    name: "Node.js button",
    locator: (page) => page.getByRole('button', { name: 'Node.js' }),
    expectedText: 'Node.js'
  },
  {
    name: "Node.js Language Dropdown text",
    locator: (page) => page.getByText('Node.jsNode.jsPythonJava.NET')
  },
  {
    name: "GitHub repository link",
    locator: (page) => page.getByRole('link', { name: 'GitHub repository' }),
    expectedHref: 'https://github.com/microsoft/playwright'
  },
  {
    name: "Discord server link",
    locator: (page) => page.getByRole('link', { name: 'Discord server' }),
    expectedHref: 'https://aka.ms/playwright/discord'
  },
  {
    name: "Theme switch button",
    locator: (page) => page.getByRole('button', { name: 'Switch between dark and light' })
  },
  {
    name: "Search button",
    locator: (page) => page.getByRole('button', { name: 'Search (Control+k)' })
  },
  {
    name: "Get Started button",
    locator: (page) => page.getByRole('link', { name: 'Get started' }),
    expectedText: 'Get started',
    expectedHref: '/docs/intro'
  }
];


const getElement = (name: string): ElementData => {
  const element = elements.find((el) => el.name === name);
  if (!element) {
    throw new Error(`Element "${name}" is not defined in the elements list`);
  }
  return element;
};

test.describe('Main Page tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  })

  test('check all elements are visible', async ({ page }) => {
    for (const element of elements) {
      await test.step(`Checking visibility of ${element.name}`, async () => {
        await expect.soft(element.locator(page)).toBeVisible();
      });
    }
  });

  test('check navigation header contains correct text', async ({ page }) => {
    const elementsWithText = elements.filter((el) => el.expectedText);

    for (const element of elementsWithText) {
      await test.step(`Checking text of ${element.name}`, async () => {
        await expect(element.locator(page)).toContainText(element.expectedText!);
      });
    }
  });

  test('check navigation hrefs', async ({ page }) => {
    const elementsWithHref = elements.filter((el) => el.expectedHref);

    for (const element of elementsWithHref) {
      await test.step(`Checking href of ${element.name}`, async () => {
        await expect(element.locator(page)).toHaveAttribute('href', element.expectedHref!);
      });
    }
  });

  test('check light mode selection', async ({ page }) => {
    const themeSwitch = getElement('Theme switch button');

    await themeSwitch.locator(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await themeSwitch.locator(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await themeSwitch.locator(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('check title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Playwright enables reliable' })).toBeVisible();
    await page.getByRole('heading', { name: 'Playwright enables reliable' }).click();
  });

  test('check get started button', async ({ page }) => {
    const getStarted = getElement('Get Started button');
    const locator = getStarted.locator(page);

    await expect.soft(locator).toBeVisible();
    await expect.soft(locator).toContainText(getStarted.expectedText!);
    await expect.soft(locator).toHaveAttribute('href', getStarted.expectedHref!);
  });

});