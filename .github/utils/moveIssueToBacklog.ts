import fetch from 'node-fetch';

interface ProjectColumn {
	name: string;
	id: number;
}

interface ProjectColumnsResponse {
	data: ProjectColumn[];
}

interface Issue {
	id: number;
	// Add other issue properties as needed
}

interface IssueResponse {
	data: Issue;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ISSUE_NUMBER = process.env.ISSUE_NUMBER!;
const ORG_NAME = 'Codetechify';
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
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	const columnsResponse = (await response.json()) as ProjectColumnsResponse;
	return columnsResponse.data;
}

async function moveIssueToColumn(
	issueNumber: number,
	columnId: number,
): Promise<void> {
	const issueUrl = `https://api.github.com/repos/${ORG_NAME}/issues/${issueNumber}`;
	const columnUrl = `https://api.github.com/projects/columns/cards/${columnId}/moves`;

	const issueResponse = await fetch(issueUrl, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3+json',
		},
	});

	if (!issueResponse.ok) {
		throw new Error(
			`HTTP error getting issue! Status: ${issueResponse.status}`,
		);
	}

	const issue = (await issueResponse.json()) as IssueResponse;
	const contentId = issue.data.id;

	const response = await fetch(columnUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			'Content-Type': 'application/json',
			Accept: 'application/vnd.github.v3+json',
		},
		body: JSON.stringify({
			content_id: contentId,
			content_type: 'Issue',
		}),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
}

(async () => {
	try {
		const columns = await fetchProjectColumns(PROJECT_ID);
		const backlogColumn = columns.find(column => column.name === 'Backlog');

		if (!backlogColumn) {
			throw new Error('Backlog column not found');
		}

		await moveIssueToColumn(parseInt(ISSUE_NUMBER), backlogColumn.id);
		console.log(`Issue ${ISSUE_NUMBER} moved to backlog column`);
	} catch (error) {
		console.error('Error:', error);
	}
})();
