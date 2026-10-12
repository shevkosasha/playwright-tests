import { test, expect, Page, Locator } from '@playwright/test';

// Апісваем інтэрфейс для элементра праекта
interface ElementData {
  name: string;
  locator: (page: Page) => Locator;
  expectedText?: string;
  attribute?: {
    type: string;
    value: string;
  };
}

const elements: ElementData[] = [
  {
    name: "Playwright logo",
    locator: (page) => page.getByRole('link', { name: 'Playwright logo Playwright' }),
    attribute: {
      type: 'href', value: '/'
    }
  },
  {
    name: "Docs link",
    locator: (page) => page.getByRole('link', { name: 'Docs' }),
    expectedText: 'Docs',
    attribute: {
      type: 'href', value: '/docs/intro'
    }
  },
  {
    name: "MCP link",
    locator: (page) => page.getByRole('link', { name: 'MCP', exact: true }),
    expectedText: 'MCP',
    attribute: {
      type: 'href', value: '/mcp/introduction'
    }
  },
  {
    name: "CLI link",
    locator: (page) => page.getByRole('link', { name: 'CLI', exact: true }),
    expectedText: 'CLI',
    attribute: {
      type: 'href', value: '/agent-cli/introduction'
    }
  },
  {
    name: "API link",
    locator: (page) => page.getByRole('link', { name: 'API' }),
    expectedText: 'API',
    attribute: {
      type: 'href', value: '/docs/api/class-playwright'
    }
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
    attribute: {
      type: 'href', value: 'https://github.com/microsoft/playwright'
    }
  },
  {
    name: "Discord server link",
    locator: (page) => page.getByRole('link', { name: 'Discord server' }),
    attribute: {
      type: 'href', value: 'https://aka.ms/playwright/discord'
    }
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
    attribute: {
      type: 'href', value: '/docs/intro'
    }
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
    await test.step('Navigate to the Playwright main page', async () => {
      await page.goto('https://playwright.dev/');
    });
  });

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

  test('check navigation attributes', async ({ page }) => {
    const elementsWithAttribute = elements.filter((el) => el.attribute);

    for (const element of elementsWithAttribute) {
      const { type, value } = element.attribute!;

      await test.step(`Checking ${type}="${value}" of ${element.name}`, async () => {
        await expect(element.locator(page)).toHaveAttribute(type, value);
      });
    }
  });

  test('check light mode selection', async ({ page }) => {
    const themeSwitch = getElement('Theme switch button');
    const html = page.locator('html');

    await test.step(`Switch to light theme using ${themeSwitch.name}`, async () => {
      await themeSwitch.locator(page).click();
      await expect(html).toHaveAttribute('data-theme', 'light');
    });

    await test.step(`Switch to dark theme using ${themeSwitch.name}`, async () => {
      await themeSwitch.locator(page).click();
      await expect(html).toHaveAttribute('data-theme', 'dark');
    });

    await test.step(`Switch back to light theme using ${themeSwitch.name}`, async () => {
      await themeSwitch.locator(page).click();
      await expect(html).toHaveAttribute('data-theme', 'light');
    });
  });

 ['light', 'dark'].forEach((value) => {
    test(`check ${value} mode`, async ({ page }) => {
      await page.evaluate((theme) => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
      }, value);

      await expect(page).toHaveScreenshot(`${value}_img.png`);
    });
  });

  test('check title', async ({ page }) => {
    const title = page.getByRole('heading', { name: 'Playwright enables reliable' });

    await test.step('Check title is visible', async () => {
      await expect(title).toBeVisible();
    });

    await test.step('Click on title', async () => {
      await title.click();
    });
  });

  test('check get started button', async ({ page }) => {
    const getStarted = getElement('Get Started button');
    const locator = getStarted.locator(page);
    const { type, value } = getStarted.attribute!;

    await test.step(`Check ${getStarted.name} is visible`, async () => {
      await expect.soft(locator).toBeVisible();
    });

    await test.step(`Check ${getStarted.name} contains text "${getStarted.expectedText}"`, async () => {
      await expect.soft(locator).toContainText(getStarted.expectedText!);
    });

    await test.step(`Check ${getStarted.name} has ${type}="${value}"`, async () => {
      await expect.soft(locator).toHaveAttribute(type, value);
    });
  });

});