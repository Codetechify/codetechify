import fetch from 'node-fetch';

// Ensure your environmental variables are set
const token = process.env.CODETECHIFY_ACCESS_TOKEN as string;
const projectId = parseInt(process.env.PROJECT_ID as string);

const githubApiBaseUrl = 'https://api.github.com';

async function getProject(projectId: number) {
	const url = `${githubApiBaseUrl}/projects/${projectId}`;
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `token ${token}`,
				Accept: 'application/vnd.github.v3+json',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching project:', error);
		throw error; // Rethrow after handling
	}
}

async function listProjectColumns(projectId: number) {
	const url = `${githubApiBaseUrl}/projects/${projectId}/columns`;
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `token ${token}`,
				Accept: 'application/vnd.github.v3+json',
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching project columns:', error);
		throw error; // Rethrow after handling
	}
}

async function run() {
	try {
		const project = await getProject(projectId);
		console.log(`Project details: ${JSON.stringify(project)}`);

		const columns = await listProjectColumns(projectId);
		console.log(`Project columns: ${JSON.stringify(columns)}`);

		// Additional logic for each column...
	} catch (error) {
		console.error(`Failed to run the script: ${error}`);
	}
}

run();
