import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';

const ACCESS_TOKEN = process.env.CODETECHIFY_ACCESS_TOKEN;
const REPO_NAME = process.env.REPO_NAME || 'codetechify-repo';
const ORG_NAME = process.env.ORG_NAME || 'Codetechify';
const PROJECT_ID = process.env.PROJECT_ID || '2';
const COLUMN_ID = 'YOUR_COLUMN_ID'; // Replace with actual Column ID for 'Backlog'

if (!ACCESS_TOKEN) {
	console.error('Access token not found');
	process.exit(1);
}

const octokit = new Octokit({ auth: ACCESS_TOKEN });
const graphqlWithAuth = graphql.defaults({
	headers: {
		authorization: `token ${ACCESS_TOKEN}`,
	},
});

async function getCardId(
	issueNumber: number,
	columnId: string,
): Promise<string | null> {
	const query = `
        query ($columnId: ID!) {
            node(id: $columnId) {
                ... on ProjectColumn {
                    cards(first: 100) {
                        nodes {
                            id
                            content {
                                ... on Issue {
                                    number
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

	const response = await graphqlWithAuth(query, { columnId });
	const cards = response.node.cards.nodes;
	const issueCard = cards.find(
		(card: any) => card.content?.number === issueNumber,
	);
	return issueCard ? issueCard.id : null;
}

async function main() {
	try {
		const issueNumber = context.issue.number; // Adjust this according to your context

		// Add label and assign to project board as previously described
		// ...

		// Retrieve the card ID for the issue
		const cardId = await getCardId(issueNumber, COLUMN_ID);
		if (!cardId) {
			console.error('Card ID not found for issue:', issueNumber);
			return;
		}

		// Move issue to 'Backlog' column
		await graphqlWithAuth(
			`
            mutation ($cardId: ID!, $columnId: ID!) {
                moveProjectCard(input: {cardId: $cardId, columnId: $columnId}) {
                    clientMutationId
                }
            }`,
			{
				cardId: cardId,
				columnId: COLUMN_ID,
			},
		);
	} catch (error) {
		console.error('Error processing issue:', error);
	}
}

main();
