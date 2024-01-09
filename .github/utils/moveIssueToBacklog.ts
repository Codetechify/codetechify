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
	title: string;
	// You can add other necessary properties of an Issue here
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PROJECT_ID = 2; // Replace with your actual project ID
const ISSUE_ID = process.env.ISSUE_ID ? parseInt(process.env.ISSUE_ID) : null;

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
		console.error(`Response Body: ${await response.text()}`);
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	const columnsResponse = (await response.json()) as ProjectColumnsResponse;
	return columnsResponse.data;
}

async function checkIssue(issueId: number) {
	const url = `https://api.github.com/repos/Codetechify/codetechify-repo/issues/${issueId}`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3+json',
		},
	});

	if (!response.ok) {
		console.error(`HTTP error! Status: ${response.status}`);
		return null;
	}

	const issue = (await response.json()) as Issue;
	return issue;
}

(async () => {
	try {
		if (ISSUE_ID) {
			const issue = await checkIssue(ISSUE_ID);
			if (issue) {
				console.log(`Issue found: ${issue.title}`);
			} else {
				console.log(`No issue found with ID: ${ISSUE_ID}`);
			}
		} else {
			console.log('No ISSUE_ID provided');
		}

		const columns = await fetchProjectColumns(PROJECT_ID);
		console.log('Project Columns:', JSON.stringify(columns, null, 2));

		const backlogColumn = columns.find(column => column.name === 'Backlog');
		if (backlogColumn) {
			console.log(`Backlog column found with ID: ${backlogColumn.id}`);
		} else {
			console.log('Backlog column not found');
		}
	} catch (error) {
		console.error('Error:', error);
	}
})();
