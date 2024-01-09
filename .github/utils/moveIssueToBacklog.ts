import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

const ACCESS_TOKEN = process.env.CODETECHIFY_ACCESS_TOKEN;
const REPO_NAME = 'codetechify-repo';
const ORG_NAME = 'Codetechify';
const PROJECT_ID = '2';

if (!ACCESS_TOKEN) {
	console.error('Access token not found');
	process.exit(1);
}

const octokit = new Octokit({ auth: ACCESS_TOKEN });

async function main() {
	// Check project board
	try {
		const project = await octokit.projects.get({
			project_id: parseInt(PROJECT_ID),
		});
		console.log('Project board exists:', project.data.name);
	} catch (error) {
		console.error('Project board check failed:', error);
		return;
	}

	// Check for feature-labeled issues
	try {
		const issues = await octokit.issues.listForRepo({
			owner: ORG_NAME,
			repo: REPO_NAME,
			labels: 'feature',
		});

		if (issues.data.length === 0) {
			console.log("No 'feature' labeled issues found.");
			return;
		}

		issues.data.forEach(issue => {
			console.log('Issue Title:', issue.title);
		});
	} catch (error) {
		console.error('Issue check failed:', error);
	}
}

main();
