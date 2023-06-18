// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getNetworkTime } = require('@destinationstransfers/ntp');
import totp from 'totp-generator';

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateOTP = async (secret: string) : Promise<string> => {
	const date = await getNetworkTime({
		server: 'time.google.com',
		port: 123,
	});

	return totp(secret, {
		timestamp: date.getTime(),
	});
};