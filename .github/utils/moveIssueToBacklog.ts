import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run() {
	try {
		// Retrieve the token and other inputs from the workflow
		const token = core.getInput('CODETECHIFY_ACCESS_TOKEN', { required: true });
		const issueId = parseInt(core.getInput('ISSUE_ID', { required: true }));
		const projectId = parseInt(core.getInput('PROJECT_ID', { required: true }));

		// Initialize Octokit with the provided token
		const octokit = getOctokit(token);

		// Example of using Octokit to retrieve issue details
		// Adjust this part as per your logic
		const { data: issue } = await octokit.rest.issues.get({
			owner: context.repo.owner,
			repo: context.repo.repo,
			issue_number: issueId,
		});

		console.log(`Issue found: ${issue.title}`);

		// Your logic to decide whether to move the issue to the backlog
		// For example, based on labels, status, etc.
		// ...

		// If conditions are met, move the issue to the backlog
		// Adjust this part as per your logic
		// ...
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error processing issue: ${error.message}`);
			if ('status' in error) {
				console.error(`HTTP Status: ${error['status']}`);
			}
		} else {
			console.error(`Unexpected error: ${error}`);
		}
	}
}

run();
