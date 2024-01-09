import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import { Endpoints } from '@octokit/types';

type ListColumnsResponse =
	Endpoints['GET /projects/{project_id}/columns']['response'];

async function moveIssueToBacklog() {
	const token = process.env.CODETECHIFY_REPO_TOKEN;
	const issueId = process.env.ISSUE_ID;
	const projectId = process.env.PROJECT_ID; // Ensure this is set in your environment

	if (!token || !issueId || !projectId) {
		console.error(
			'Missing environment variables: CODETECHIFY_REPO_TOKEN, ISSUE_ID, or PROJECT_ID',
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

		// Fetch project columns
		const columnsResponse: ListColumnsResponse =
			await octokit.rest.projects.listColumns({
				project_id: parseInt(projectId),
			});

		const columns = columnsResponse.data;

		// Check if 'Backlog' column exists
		const backlogColumn = columns.find(column => column.name === 'Backlog');
		if (!backlogColumn) {
			console.error('Backlog column not found');
			return;
		}

		console.log(`Backlog column found: ${backlogColumn.name}`);

		// Add logic here to move the issue to the 'Backlog' column
	} catch (error) {
		console.error(`Error processing issue: ${error}`);
	}
}

moveIssueToBacklog();
