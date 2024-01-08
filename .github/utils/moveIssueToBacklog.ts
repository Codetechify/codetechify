import fetch from 'node-fetch';

interface ProjectColumn {
	name: string;
	id: string;
}

interface Project {
	id: string;
	columns: {
		nodes: ProjectColumn[];
	};
}

interface GraphQLResponse {
	data: {
		organization: {
			project: Project;
		};
	};
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ISSUE_NUMBER = process.env.ISSUE_NUMBER!; // Ensure ISSUE_NUMBER is defined
const ORG_NAME = 'Codetechify'; // Replace with your organization's name
const PROJECT_NUMBER = 2; // Replace with your project number

const query = `
{
  organization(login: "${ORG_NAME}") {
    project(number: ${PROJECT_NUMBER}) {
      id
      columns(first: 10) {
        nodes {
          name
          id
        }
      }
    }
  }
}
`;

async function fetchProjectInfo(): Promise<GraphQLResponse> {
	const response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ query }),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	return response.json() as Promise<GraphQLResponse>;
}

async function moveIssueToBacklog(columnId: string) {
	const url = `https://api.github.com/projects/columns/${columnId}/cards`;

	const body = {
		content_id: parseInt(ISSUE_NUMBER, 10),
		content_type: 'Issue',
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			'Content-Type': 'application/json',
			Accept: 'application/vnd.github.v3+json',
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	return response.json();
}

fetchProjectInfo()
	.then(data => {
		const projectInfo = data.data.organization.project;
		if (!projectInfo || !projectInfo.columns) {
			throw new Error('Project or columns data is missing');
		}
		const backlogColumn = projectInfo.columns.nodes.find(
			column => column.name === 'Backlog',
		);
		if (!backlogColumn) {
			throw new Error('Backlog column not found');
		}
		return moveIssueToBacklog(backlogColumn.id);
	})
	.catch(error => console.error('Error:', error));
