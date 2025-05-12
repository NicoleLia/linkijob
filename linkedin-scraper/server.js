const express = require('express');
const cors = require('cors');
const { scrapeLinkedIn } = require('./scraper');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/scrape', async (req, res) => {
	const { keywords, location } = req.body;
	if (!keywords || !location || !Array.isArray(keywords)) {
		return res.status(400).json({ error: 'Please enter keywords array and location string' });
	}

	try {
		console.log(`Begin: ${keywords.join(', ')} @ ${location}`);
		const jobs = await scrapeLinkedIn({ keywords, location });
		res.json({ count: jobs.length, jobs });
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`✅ Server running at http://localhost:${port}`);
});
