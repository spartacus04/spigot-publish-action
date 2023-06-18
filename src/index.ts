import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
dotenv.config();

import { DESCRIPTION, EMAIL, EXTERNAL_DOWNLOAD_URL, FILE_PATH, OTP_SECRET, PASSWORD, TITLE, UPDATE_PAGE, VERSION } from './config';
import { generateOTP, wait } from './utils';

puppeteer.use(StealthPlugin());

puppeteer.launch({ headless: false }).then(async browser => {
	const page = await browser.newPage();

	try {
		// Auth
		await page.goto(UPDATE_PAGE, { waitUntil: 'networkidle2' });
		await page.waitForSelector('input#ctrl_pageLogin_login');

		await page.type('input#ctrl_pageLogin_login', EMAIL, { delay: 100 });

		await wait(1000);

		await page.type('input#ctrl_pageLogin_password:not(.uix_fixIOSClickInput)', PASSWORD, { delay: 100 });

		(await page.$$('input[type="submit"][value="Log in"]'))[2].click();

		await page.waitForNavigation({ waitUntil: 'networkidle2' });

		// OTP
		await page.type('input#ctrl_totp_code', await generateOTP(OTP_SECRET));
		await page.click('input[type="submit"][name="save"]');

		await page.waitForNavigation({ waitUntil: 'networkidle2' });

		console.log('Logged in');

		if(FILE_PATH) {
			await page.click('input#ctrl_resource_file_type_file');

		} else if(EXTERNAL_DOWNLOAD_URL && typeof EXTERNAL_DOWNLOAD_URL != 'undefined') {
			await page.click('input#ctrl_resource_file_type_url');

			await page.waitForSelector('input[name="download_url"]');
			await page.type('input[name="download_url"]', EXTERNAL_DOWNLOAD_URL);
		} else {
			throw new Error('No file path or external download url provided');
		}

		await page.type('input#ctrl_version_string', VERSION);
		await page.type('input#ctrl_title', TITLE);

		const messageIframe = await (await page.$('iframe.redactor_textCtrl')).contentFrame();
		await messageIframe.type('body', DESCRIPTION);
	}
	catch (e) {
		page.screenshot({ path: 'error.png' });
		console.error(e);
	}
	finally {
		// await browser.close();
	}
});

