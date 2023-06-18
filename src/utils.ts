const { getNetworkTime } = require('@destinationstransfers/ntp');
import totp from 'totp-generator';

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateOTP = async (secret: string) : Promise<string> => {
	// fetch ntp time from time.google.com
	const date = await getNetworkTime({
		server: 'time.google.com', // ntp server address
		port: 123, // NTP server port
	})

	return totp(secret, {
		timestamp: date.getTime()
	});
}