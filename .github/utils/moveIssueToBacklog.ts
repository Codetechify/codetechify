import fetch from 'node-fetch';

interface Issue {
	id: number;
	title: string;
	body: string; // This represents the description
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string; // Asserting GITHUB_TOKEN as string
const PROJECT_ID = 2; // Replace with the actual ID of the project
const ISSUE_ID = parseInt(process.env.ISSUE_ID || '', 10); // Fallback to an empty string if ISSUE_ID is not set

async function fetchIssue(issueId: number): Promise<Issue> {
	if (!Number.isInteger(issueId)) {
		throw new Error('Issue ID is not provided or not a number');
	}

	const url = `https://api.github.com/repos/Codetechify/codetechify-repo/issues/${issueId}`;

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

	return response.json() as Promise<Issue>;
}

(async () => {
	try {
		const issue = await fetchIssue(ISSUE_ID);
		console.log(`Issue Title: ${issue.title}`);
		console.log(`Issue Description: ${issue.body}`);
	} catch (error) {
		console.error('Error:', error);
	}
})();
