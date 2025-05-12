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
			alert('请输入关键词和地点');
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
			alert('抓取失败: ' + error.message);
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
		<Container sx={{ mt: 4 }}>
			<Typography variant='h4' gutterBottom>
				LinkedIn 职位抓取工具
			</Typography>
			<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
				<TextField
					label='关键词 (用英文逗号分隔)'
					value={keywords}
					onChange={(e) => setKeywords(e.target.value)}
					fullWidth
				/>
				<TextField
					label='地点'
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					fullWidth
				/>
				<Button variant='contained' onClick={handleScrape} disabled={loading}>
					{loading ? <CircularProgress size={24} /> : '开始抓取'}
				</Button>
				<Button variant='outlined' onClick={handleExport} disabled={jobs.length === 0}>
					导出 CSV
				</Button>
			</Box>

			{jobs.length > 0 && (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>职位</TableCell>
								<TableCell>公司</TableCell>
								<TableCell>地点</TableCell>
								<TableCell>发布时间</TableCell>
								<TableCell>链接</TableCell>
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
											查看
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
