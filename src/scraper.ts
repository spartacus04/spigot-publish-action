import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch-commonjs';
import puppeteer from 'puppeteer-extra';
import { PuppeteerLaunchOptions } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { DESCRIPTION, EMAIL, DOWNLOAD_URL, IS_FILE, NODE_ENV, OTP_SECRET, PASSWORD, TITLE, UPDATE_PAGE, VERSION, FILE_NAME } from './config';
import { generateOTP, wait } from './utils';
import './parameters';

puppeteer.use(StealthPlugin());

console.log('Starting browser...');

const config : PuppeteerLaunchOptions = NODE_ENV == 'prod' ? {
	headless: 'new',
	executablePath: '/usr/bin/chromium-browser',
	args: ['--no-sandbox'],
} : {
	headless: false,
	args: ['--no-sandbox'],
};

puppeteer.launch(config).then(async browser => {
	const page = await browser.newPage();

	try {
		await page.goto(UPDATE_PAGE, { waitUntil: 'networkidle2' });
		console.log('Logging in...');
		await page.waitForSelector('input#ctrl_pageLogin_login');

		await page.type('input#ctrl_pageLogin_login', EMAIL, { delay: 100 });

		await wait(1000);

		await page.type('input#ctrl_pageLogin_password:not(.uix_fixIOSClickInput)', PASSWORD, { delay: 100 });

		(await page.$$('input[type="submit"][value="Log in"]'))[2].click();

		await page.waitForNavigation({ waitUntil: 'networkidle2' });

		// OTP
		console.log('Entering OTP...');
		await page.type('input#ctrl_totp_code', await generateOTP(OTP_SECRET));
		await page.click('input[type="submit"][name="save"]');

		await page.waitForNavigation({ waitUntil: 'networkidle2' });

		console.log('Logged in');

		if(IS_FILE) {
			console.log('Uploading file...');

			const response = await fetch(DOWNLOAD_URL, {
				method: 'GET',
			});

			const buffer = await response.arrayBuffer();

			// write to file system
			const filepath = path.resolve(process.cwd(), FILE_NAME);
			fs.writeFileSync(filepath, Buffer.from(buffer));

			await page.click('input#ctrl_resource_file_type_file');
			await page.waitForSelector('input[type="file"');
			(await page.$$('input[type="file"'))[0].uploadFile(filepath);

			console.log('Setting metadata...');
		}
		else {
			console.log('Setting metadata...');
			await page.click('input#ctrl_resource_file_type_url');

			await page.waitForSelector('input[name="download_url"]');
			await page.type('input[name="download_url"]', DOWNLOAD_URL);
		}

		await page.type('input#ctrl_version_string', VERSION);
		await page.type('input#ctrl_title', TITLE);

		const messageIframe = await (await page.$('iframe.redactor_textCtrl')).contentFrame();
		await messageIframe.type('body', DESCRIPTION);

		if(NODE_ENV == 'prod') {
			await page.click('input[type=submit][value="Save Update"]');
		}
	}
	catch (e) {
		page.screenshot({ path: 'error.png' });
		console.error(e);
	}
	finally {
		await browser.close();
		console.log('Done!');
	}
});

