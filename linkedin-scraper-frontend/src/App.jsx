import React, { useState } from 'react';
import {
	Container,
	TextField,
	Button,
	Typography,
	Box,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';
import { scrapeJobs } from './api';
import Papa from 'papaparse';

function App() {
	const [keywords, setKeywords] = useState('');
	const [location, setLocation] = useState('New Zealand');
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleScrape = async () => {
		if (!keywords || !location) {
			alert('please enter keywords and location');
			return;
		}

		const keywordList = keywords
			.split(',')
			.map((k) => k.trim())
			.filter((k) => k);
		setLoading(true);
		try {
			const result = await scrapeJobs(keywordList, location);
			setJobs(result.jobs);
		} catch (error) {
			alert('get error: ' + error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleExport = () => {
		const csv = Papa.unparse(jobs);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'linkedin_jobs.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<Container sx={{ mt: 0 }}>
			<Typography variant='h4' gutterBottom color='primary'>
				LinkedIn Daily Job Scraper
			</Typography>
			<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
				<TextField
					label='keywords (comma separated)'
					helperText='for example: "software engineer, data analyst"'
					value={keywords}
					onChange={(e) => setKeywords(e.target.value)}
					fullWidth
				/>
				<TextField
					label='Post Location'
					helperText='for example: "New Zealand"'
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					fullWidth
				/>
				<Button variant='contained' onClick={handleScrape} disabled={loading}>
					{loading ? <CircularProgress size={24} /> : 'begin scraping'}
				</Button>
				<Button variant='outlined' onClick={handleExport} disabled={jobs.length === 0}>
					export to CSV
				</Button>
			</Box>

			{jobs.length > 0 && (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>position</TableCell>
								<TableCell>company</TableCell>
								<TableCell>location</TableCell>
								<TableCell>release time</TableCell>
								<TableCell>link</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{jobs.map((job, index) => (
								<TableRow key={index}>
									<TableCell>{job.title}</TableCell>
									<TableCell>{job.company}</TableCell>
									<TableCell>{job.location}</TableCell>
									<TableCell>{job.posted}</TableCell>
									<TableCell>
										<a href={job.link} target='_blank' rel='noopener noreferrer'>
											check
										</a>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
}

export default App;
