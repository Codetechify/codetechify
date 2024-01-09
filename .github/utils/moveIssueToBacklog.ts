import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

// Define types or interfaces for your custom data structures
interface MyCustomData {
	// Define your custom fields here
}

// Type definitions for API responses
type GetProjectResponseType =
	RestEndpointMethodTypes['projects']['get']['response'];

// Ensure your environmental variables are set
const token = process.env.CODETECHIFY_ACCESS_TOKEN as string;
const repoName = process.env.REPO_NAME as string;
const orgName = process.env.ORG_NAME as string;
const projectId = parseInt(process.env.PROJECT_ID as string);

// Create a new Octokit instance
const octokit = new Octokit({ auth: token });

async function getProject(projectId: number): Promise<GetProjectResponseType> {
	try {
		const response = await octokit.rest.projects.get({
			project_id: projectId,
		});
		return response;
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		} else {
			core.setFailed('Unknown error occurred');
		}
		throw error; // Rethrow after handling
	}
}

async function run() {
	try {
		const project = await getProject(projectId);
		// Additional logic...
	} catch (error) {
		core.setFailed(`Failed to run the script: ${error}`);
	}
}

run();
