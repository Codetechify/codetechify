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
	// Add other necessary properties of an Issue here
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PROJECT_ID = 2; // Replace with the actual ID of the project

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

(async () => {
	try {
		const columns = await fetchProjectColumns(PROJECT_ID);
		console.log('Project Columns:', JSON.stringify(columns, null, 2));
	} catch (error) {
		console.error('Error:', error);
	}
})();
