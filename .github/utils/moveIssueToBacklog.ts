import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

async function moveIssueToBacklog() {
	const token = process.env.CODETECHIFY_REPO_TOKEN;
	const issueId = process.env.ISSUE_ID;

	if (!token || !issueId) {
		console.error(
			'Missing environment variables: CODETECHIFY_REPO_TOKEN or ISSUE_ID',
		);
		process.exit(1);
	}

	const octokit = new Octokit({
		auth: token,
		request: {
			fetch,
		},
	});

	try {
		// Replace with your repository's owner and name
		const owner = 'Codetechify';
		const repo = 'codetechify-repo';

		// Fetch the issue
		const issue = await octokit.rest.issues.get({
			owner,
			repo,
			issue_number: parseInt(issueId),
		});

		console.log(`Issue found: ${issue.data.title}`);

		// Add additional logic here to move the issue to the backlog
	} catch (error) {
		console.error(`Error processing issue: ${error}`);
	}
}

moveIssueToBacklog();
