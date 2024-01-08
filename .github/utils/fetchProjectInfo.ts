import fetch from 'node-fetch';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ORG_NAME = 'Codetechify'; // Replace with your organization's name
const PROJECT_NUMBER = your - project - number; // Replace with your project number

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

async function fetchProjectInfo() {
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

	return response.json();
}

fetchProjectInfo()
	.then(data => console.log(data))
	.catch(error => console.error('Error fetching project info:', error));
