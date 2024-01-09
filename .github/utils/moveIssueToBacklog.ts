import fetch from 'node-fetch';

interface ProjectColumn {
	name: string;
	id: number;
}

interface ProjectColumnsResponse {
	data: ProjectColumn[];
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PROJECT_ID = 2; // Replace with the actual ID of the project

async function fetchProjectColumns(
	projectId: number,
): Promise<ProjectColumn[]> {
	const url = `https://api.github.com/projects/${projectId}/columns`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3+json',
		},
	});

	if (!response.ok) {
		console.error(`HTTP error! Status: ${response.status}`);
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	const columnsResponse = (await response.json()) as ProjectColumnsResponse;
	return columnsResponse.data;
}

async function moveIssueToBacklog(issueId: number, projectId: number) {
	const columns = await fetchProjectColumns(projectId);
	const backlogColumn = columns.find(column => column.name === 'Backlog');
	if (!backlogColumn) {
		throw new Error('Backlog column not found');
	}

	const cardUrl = `https://api.github.com/projects/columns/${backlogColumn.id}/cards`;

	const response = await fetch(cardUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3+json',
		},
		body: JSON.stringify({ content_id: issueId, content_type: 'Issue' }),
	});

	if (!response.ok) {
		console.error(`HTTP error! Status: ${response.status}`);
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	console.log('Issue moved to backlog');
}

(async () => {
	try {
		const issueId = parseInt(process.env.ISSUE_ID || '');
		if (isNaN(issueId)) {
			throw new Error('Invalid or missing ISSUE_ID environment variable');
		}
		await moveIssueToBacklog(issueId, PROJECT_ID);
	} catch (error) {
		console.error('Error:', error);
	}
})();
