import axios from 'axios';

const API_URL = 'http://localhost:3000/scrape';

export const scrapeJobs = async (keywords, location) => {
	const response = await axios.post(API_URL, {
		keywords,
		location,
	});
	return response.data;
};
