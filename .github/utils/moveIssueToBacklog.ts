import { getOctokit } from '@actions/github';

async function run() {
	try {
		const token = process.env.CODETECHIFY_ACCESS_TOKEN;
		if (!token) {
			throw new Error('CODETECHIFY_ACCESS_TOKEN is not provided');
		}

		const issueNumberString = process.env.ISSUE_ID;
		if (!issueNumberString) {
			throw new Error('ISSUE_ID is not provided');
		}
		const issueNumber = parseInt(issueNumberString, 10);
		if (isNaN(issueNumber)) {
			throw new Error('ISSUE_ID is not a valid number');
		}

		const octokit = getOctokit(token);

		const { data: issue } = await octokit.rest.issues.get({
			owner: process.env.GITHUB_REPOSITORY_OWNER || '',
			repo: process.env.GITHUB_REPOSITORY || '',
			issue_number: issueNumber,
		});

		const isFeature = issue.labels.some(
			(label: any) => typeof label === 'object' && label.name === 'feature',
		);

		if (isFeature) {
			console.log(`Issue titled '${issue.title}' is labeled with 'feature'.`);
		} else {
			console.log(
				`Issue titled '${issue.title}' is not labeled with 'feature'.`,
			);
		}
	} catch (error) {
		if (typeof error === 'object' && error !== null && 'message' in error) {
			console.error(`Error: ${(error as Error).message}`);
		} else {
			console.error('Unknown error occurred.');
		}
	}
}

run();
