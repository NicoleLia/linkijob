const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
puppeteer.use(StealthPlugin());

async function scrapeLinkedIn({ keywords, location }) {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 800 });
	const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf8'));
	await page.setCookie(...cookies);

	await page.goto('https://www.linkedin.com/feed/', {
		waitUntil: 'domcontentloaded',
		timeout: 60000,
	});

	const loggedIn = await page.$('img.global-nav__me-photo');
	if (!loggedIn) {
		await browser.close();
		throw new Error(
			'Login failed, cookie may have expired. Please log in to LinkedIn and save the cookies again.'
		);
	}

	const allJobs = [];

	for (const keyword of keywords) {
		console.log(`Capturing keywords:${keyword}`);
		let pageNum = 0;
		let hasNextPage = true;

		while (hasNextPage && pageNum < 10) {
			const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
				keyword
			)}&location=${encodeURIComponent(location)}&f_TPR=r86400&start=${pageNum * 25}`;

			await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
			await new Promise((resolve) => setTimeout(resolve, 3000));
			await autoScroll(page);

			const jobsOnPage = await page.$$eval('li.scaffold-layout__list-item', (cards) =>
				cards.map((card) => {
					const titleEl = card.querySelector('a.job-card-list__title--link');
					const companyEl = card.querySelector('.artdeco-entity-lockup__subtitle span');
					const locationEl = card.querySelector('.job-card-container__metadata-wrapper li span');
					const timeEl = card.querySelector('time');
					const posted = timeEl
						? timeEl.getAttribute('datetime') || timeEl.innerText.trim()
						: 'N/A';

					return {
						title: titleEl ? titleEl.innerText.trim() : '',
						company: companyEl ? companyEl.innerText.trim() : '',
						location: locationEl ? locationEl.innerText.trim() : '',
						posted: posted,
						link: titleEl
							? titleEl.href.startsWith('https://')
								? titleEl.href
								: `https://www.linkedin.com${titleEl.getAttribute('href')}`
							: '',
					};
				})
			);

			console.log(`Found ${jobsOnPage.length} jobs (page ${pageNum + 1})`);
			allJobs.push(...jobsOnPage);

			hasNextPage = (await page.$(`button[aria-label="Page ${pageNum + 2}"]`)) !== null;
			pageNum++;
		}
	}

	await browser.close();
	return deduplicateJobs(allJobs);
}

// Deduplicate jobs based on title and link
// If a job has no title or link, it will be excluded
function deduplicateJobs(jobs) {
	const seen = new Set();
	return jobs.filter((job) => {
		if (!job.title || !job.link) return false;
		if (seen.has(job.link)) return false;
		seen.add(job.link);
		return true;
	});
}

async function autoScroll(page) {
	await page.evaluate(async () => {
		await new Promise((resolve) => {
			let totalHeight = 0;
			const distance = 300;
			const timer = setInterval(() => {
				window.scrollBy(0, distance);
				totalHeight += distance;
				if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
					clearInterval(timer);
					resolve();
				}
			}, 500);
		});
	});
}

module.exports = { scrapeLinkedIn };
