import { DOWNLOAD_URL, EMAIL, FILE_NAME, IS_FILE, OTP_SECRET, PASSWORD, TITLE, UPDATE_PAGE, VERSION } from 'config';

if(!UPDATE_PAGE) {
	console.error('No update page provided');
	process.exit(1);
}

if(!EMAIL) {
	console.error('No email provided');
	process.exit(1);
}

if(!PASSWORD) {
	console.error('No password provided');
	process.exit(1);
}

if(!OTP_SECRET) {
	console.error('No otp secret provided');
	process.exit(1);
}

if(!DOWNLOAD_URL) {
	console.error('No download url provided');
	process.exit(1);
}

if(IS_FILE && !FILE_NAME) {
	console.error('No file name provided');
	process.exit(1);
}

if(!VERSION) {
	console.error('No version provided');
	process.exit(1);
}

if(!TITLE) {
	console.error('No title provided');
	process.exit(1);
}
