import { test, expect, Locator, Page } from "@playwright/test";

const url = 'https://playwright.dev/';

interface ElementData {
  name: string;
  locator: (page: Page) => Locator;
  expectedText?: string;
  attribute?: {
    type: string;
    value: string;
  };
}

export class MainPage {
    readonly page: Page;
    readonly elements: ElementData[];

    constructor (page: Page) {
        this.page = page;
        this.elements = [
            {
                name: "Playwright logo",
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Playwright logo Playwright' }),
                attribute: { type: 'href', value: '/'}
            },
            {
                name: "Docs link",
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Docs' }),
                expectedText: 'Docs',
                attribute: {
                    type: 'href', value: '/docs/intro'
                }
            },
            {
                name: "MCP link",
                locator: (page: Page): Locator => page.getByRole('link', { name: 'MCP', exact: true }),
                expectedText: 'MCP',
                attribute: {  type: 'href', value: '/mcp/introduction'}
            },
            {
                name: "CLI link",
                locator: (page: Page): Locator => page.getByRole('link', { name: 'CLI', exact: true }),
                expectedText: 'CLI',
                attribute: {  type: 'href', value: '/agent-cli/introduction'}
            },
            {
                name: "API link",
                locator: (page: Page): Locator => page.getByRole('link', { name: 'API' }),
                expectedText: 'API',
                attribute: { type: 'href', value: '/docs/api/class-playwright'}
            },
            {
                name: "Node.js button",
                locator: (page: Page): Locator => page.getByRole('button', { name: 'Node.js' }),
                expectedText: 'Node.js'
            },
            {
                name: "Node.js Language Dropdown text",
                locator: (page: Page): Locator => page.getByText('Node.jsNode.jsPythonJava.NET')
            },
            {
                name: "GitHub repository link",
                locator: (page: Page): Locator => page.getByRole('link', { name: 'GitHub repository' }),
                attribute: { type: 'href', value: 'https://github.com/microsoft/playwright' }
            },
            {
                name: "Discord server link",
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Discord server' }),
                attribute: {type: 'href', value: 'https://aka.ms/playwright/discord'}
            },
            {
                name: "Theme switch button",
                locator: (page: Page): Locator => page.getByRole('button', { name: 'Switch between dark and light' })
            },
            {
                name: "Search button",
                locator: (page: Page): Locator => page.getByRole('button', { name: 'Search (Control+k)' })
            },
            {
                name: "Get Started button",
                locator: (page: Page): Locator => page.getByRole('link', { name: 'Get started' }),
                expectedText: 'Get started',
                attribute: { type: 'href', value: '/docs/intro'}
            }
        ];
    }

    async open(){
        await this.page.goto(url);
    }

    async checkElementsVisibility (){
        for (const {locator, name} of this.elements) {
            await test.step(`Checking visibility of ${name}`, async () => {
                await expect.soft(locator(this.page)).toBeVisible();
            });
        }
    }

    async checkElementsText (){
        const elementsWithText = this.elements.filter((el) => el.expectedText);

        for (const {locator, name, expectedText} of elementsWithText) {
            await test.step(`Checking text of ${name}`, async () => {
                await expect(locator(this.page)).toContainText(expectedText!);
            });
        }
    }

    async checkNavAttributes (){
        const elementsWithAttribute = this.elements.filter((el) => el.attribute);

        for (const {locator, name, attribute} of elementsWithAttribute) {
            const { type, value } = attribute!;

            await test.step(`Checking ${type}="${value}" of ${name}`, async () => {
                await expect(locator(this.page)).toHaveAttribute(type, value);
            });
        }
    }

    async toggleAndCheckLightMode (mode: string) {
        const themeSwitch = this.getElement('Theme switch button');
        const html = this.page.locator('html');
        await test.step(`Switch to light theme using ${themeSwitch.name}`, async () => {
            await themeSwitch.locator(this.page).click();
            await expect(html).toHaveAttribute('data-theme', mode);
        });
    }

    async setLightMode (mode: string) {
        await this.page.evaluate((theme) => {
            document.querySelector('html')?.setAttribute('data-theme', theme);
        }, mode);
    }

    async checkLightModeScreenshot (mode: string) {
        await expect(this.page).toHaveScreenshot(`${mode}_img.png`);
    }

    async checkTitle() {
        const title = this.page.getByRole('heading', { name: 'Playwright enables reliable' });

        await test.step('Check title is visible', async () => {
            await expect(title).toBeVisible();
        });

        await test.step('Click on title', async () => {
            await title.click();
        });
    }

    async checkGetStartedBtn(){
        const getStarted = this.getElement('Get Started button');
        const locator = getStarted.locator(this.page);
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
    }

    getElement = (name: string): ElementData => {
      const element = this.elements.find((el) => el.name === name);
      if (!element) {
        throw new Error(`Element "${name}" is not defined in the elements list`);
      }
      return element;
    };

}