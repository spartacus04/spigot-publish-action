(async () => {
	try {
		require.resolve('dotenv');

		const { config } = await require('dotenv');
		config();
	}
	catch(_) { null; }

	import('./scraper');
})();