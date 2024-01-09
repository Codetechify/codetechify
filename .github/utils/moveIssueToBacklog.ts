import { getOctokit } from '@actions/github';

async function run() {
	try {
		// Retrieve the token from environment variables
		const token = process.env.CODETECHIFY_ACCESS_TOKEN;
		if (!token) {
			throw new Error('CODETECHIFY_ACCESS_TOKEN is not provided');
		}

		// Retrieve issue number from environment variables
		const issueNumber = parseInt(process.env.ISSUE_ID, 10);
		if (isNaN(issueNumber)) {
			throw new Error('ISSUE_ID is not a valid number');
		}

		// Initialize Octokit with the provided token
		const octokit = getOctokit(token);

		// Retrieve issue details
		const { data: issue } = await octokit.rest.issues.get({
			owner: process.env.GITHUB_REPOSITORY_OWNER,
			repo: process.env.GITHUB_REPOSITORY,
			issue_number: issueNumber,
		});

		// Check if the issue is labeled with 'feature'
		const isFeature = issue.labels.some(label => label.name === 'feature');

		if (isFeature) {
			console.log(`Issue titled '${issue.title}' is labeled with 'feature'.`);
		} else {
			console.log(
				`Issue titled '${issue.title}' is not labeled with 'feature'.`,
			);
		}
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}

run();
