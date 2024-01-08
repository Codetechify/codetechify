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
const ISSUE_NUMBER = process.env.ISSUE_NUMBER; // Get issue number from environment variable
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

async function moveIssueToBacklog(projectId: string, columnId: string) {
	// Add your logic here to move the issue to the backlog column
	// Use GitHub's REST API to update the project card
}

fetchProjectInfo()
	.then(data => {
		const projectInfo = data.data.organization.project;
		const backlogColumn = projectInfo.columns.nodes.find(
			column => column.name === 'Backlog',
		); // Assuming the column name is 'Backlog'
		if (backlogColumn) {
			return moveIssueToBacklog(projectInfo.id, backlogColumn.id);
		} else {
			throw new Error('Backlog column not found');
		}
	})
	.catch(error => console.error('Error:', error));
