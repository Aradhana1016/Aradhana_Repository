import { test, expect } from '@playwright/test';

    test.describe('Web Automation Tasks', () => {
      const url = 'https://d3pv22lioo8876.cloudfront.net/tiptop/';
  
      test.beforeEach(async ({ page }) => {
        await page.goto(url);
      });
  
      test('Verify that the text input element with xpath is disabled in the form', async ({ page }) => {
        const disabledInput = await page.locator("//*[contains(text(), 'Disabled input')]");
        await expect(disabledInput).toBeDisabled();
      });
  
      test("Verify that the text input with value 'Readonly input' is in readonly state by using 2 xpaths", async ({ page }) => {
        const readonlyInput1 = await page.locator("//input[@name='my-readonly']");
        const readonlyInput2 = await page.locator("//input[@value='Readonly input']");
        expect(await readonlyInput1.getAttribute('readonly')).not.toBeNull(); 
        expect(await readonlyInput2.getAttribute('readonly')).not.toBeNull();
      });
  
      test('Verify that the dropdown field to select color has 8 elements using 2 xpaths', async ({ page }) => {
        const dropdown1 = await page.locator("//select[@class='form-select']");
        const options1 = dropdown1.locator('option'); 
        expect(await options1.count()).toBe(8);
        const dropdown2 = await page.locator("//select[@class='form-select']");
        const options2 = dropdown2.locator('option');
        expect(await options2.count()).toBe(8);
      });
  
      test('Verify that the submit button is disabled when no data is entered in Name field', async ({ page }) => {
        const submitButton = await page.locator('//button[@id="submit-form"]');
        await expect(submitButton).toBeDisabled();
      });
  
      test('Verify that the submit button is enabled when both Name and Password fields are entered', async ({ page }) => {
        await page.locator('//input[@id="my-name-id"]').fill('Aradhana');
        await page.locator('//input[@id="my-password-id"]').fill('1234567');
        const submitButton = await page.locator('//button[@id="submit-form"]');
        await expect(submitButton).toBeEnabled();
      });
  
      test("Verify that on submit of 'Submit' button the page shows 'Received' text", async ({ page }) => {
        await page.locator('//input[@id="my-name-id"]').fill('Aradhana');
        await page.locator('//input[@id="my-password-id"]').fill('1234567');
        await page.locator('//button[@id="submit-form"]').click();
        const receivedText = await page.locator("//*[contains(text(), 'Received!')]");
        await expect(receivedText).toBeVisible();
      });
  
      test('Verify that on submit of form all the data passed to the URL', async ({ page, request }) => {

        let interceptedURL = null;
        await page.route('**/*', (route, request) => {
       if (request.url().startsWith('https://d3pv22lioo8876.cloudfront.net/tiptop/') && request.method() === 'GET') {
      interceptedURL = request.url();
    }
    route.continue();
  });


    const name=  await page.fill('//input[@id="my-name-id"]','Aradhana');
    const password=  await page.fill('//input[@id="my-password-id"]' ,'1234567') 
    // const disableinput = await page.locator("//*[contains(text(), 'Disabled input')]").click()
     const readonly= await page.click("//input[@name='my-readonly']" ,'Readonly input')
     const select = await page.selectOption("//select[@class='form-select']",'Green')
     const submit = await page.locator('//button[@id="submit-form"]').click()

      await page.waitForTimeout(10000);

      expect(interceptedURL).not.toBeNull();

  // Parse the query string using URL module
      const parsedURL = new URL(interceptedURL);
      const queryParams = parsedURL.searchParams;

      expect(queryParams.get('my-name')).toBe('Aradhana');
      expect(queryParams.get('my-password')).toBe('1234567');
      expect(queryParams.get('my-readonly')).toBe('Readonly input');
      expect(queryParams.get('my-select')).toBe('green');

      console.log('Form data added to the URL as query parameters:', interceptedURL);

      }); 
    }); 
