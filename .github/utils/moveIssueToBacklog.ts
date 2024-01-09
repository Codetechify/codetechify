import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import { Endpoints } from '@octokit/types';

type ListColumnsResponse =
	Endpoints['GET /projects/{project_id}/columns']['response'];

async function moveIssueToBacklog() {
	const token = process.env.CODETECHIFY_ACCESS_TOKEN;
	const issueId = process.env.ISSUE_ID;
	const projectId = process.env.PROJECT_ID; // Ensure this is set in your environment

	if (!token || !issueId || !projectId) {
		console.error(
			'Missing environment variables: CODETECHIFY_ACCESS_TOKEN, ISSUE_ID, or PROJECT_ID',
		);
		process.exit(1);
	}

	const octokit = new Octokit({
		auth: token,
		request: {
			fetch,
		},
	});

	await checkAuthentication(octokit);
	await checkRepoPermissions(octokit, 'Codetechify', 'codetechify-repo');
	await testApiCall(octokit);

	try {
		// Fetch the issue
		const issue = await octokit.rest.issues.get({
			owner: 'Codetechify',
			repo: 'codetechify-repo',
			issue_number: parseInt(issueId),
		});

		console.log(`Issue found: ${issue.data.title}`);

		// Fetch project columns
		const columnsResponse: ListColumnsResponse =
			await octokit.rest.projects.listColumns({
				project_id: parseInt(projectId),
			});

		// Further processing...
	} catch (error) {
		if (error instanceof Octokit.HttpError) {
			console.error(`Error processing issue: ${error.status} ${error.message}`);
			console.error(`Request URL: ${error.request.url}`);
			console.error(`Request method: ${error.request.method}`);
		} else {
			console.error(`Error processing issue: ${error}`);
		}
	}
}

async function checkAuthentication(octokit: Octokit) {
	try {
		const response = await octokit.rest.users.getAuthenticated();
		console.log(`Authenticated as: ${response.data.login}`);
	} catch (error) {
		console.error(`Authentication failed: ${error}`);
	}
}

async function checkRepoPermissions(
	octokit: Octokit,
	owner: string,
	repo: string,
) {
	try {
		const user = await octokit.rest.users.getAuthenticated();
		const response = await octokit.rest.repos.getCollaboratorPermissionLevel({
			owner,
			repo,
			username: user.data.login,
		});
		console.log(`Permission level: ${response.data.permission}`);
	} catch (error) {
		console.error(`Error checking permissions: ${error}`);
	}
}

async function testApiCall(octokit: Octokit) {
	try {
		const response = await octokit.rest.issues.listForRepo({
			owner: 'Codetechify',
			repo: 'codetechify-repo',
		});
		console.log(`Issues fetched: ${response.data.length}`);
	} catch (error) {
		console.error(`Error fetching issues: ${error}`);
	}
}

moveIssueToBacklog();
