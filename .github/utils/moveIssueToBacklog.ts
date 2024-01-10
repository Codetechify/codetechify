import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

// Assuming you have installed @octokit/plugin-rest-endpoint-methods
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

// Type definitions for API responses
type GetProjectResponseType =
	RestEndpointMethodTypes['projects']['get']['response'];
type ListColumnsResponseType =
	RestEndpointMethodTypes['projects']['listColumns']['response'];

// Ensure your environmental variables are set
const token = process.env.CODETECHIFY_ACCESS_TOKEN as string;
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

async function listProjectColumns(
	projectId: number,
): Promise<ListColumnsResponseType> {
	try {
		const response = await octokit.rest.projects.listColumns({
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
		core.info(`Project details: ${JSON.stringify(project.data)}`);

		const columns = await listProjectColumns(projectId);
		core.info(`Project columns: ${JSON.stringify(columns.data)}`);

		// Additional logic for each column...
	} catch (error) {
		core.setFailed(`Failed to run the script: ${error}`);
	}
}

run();
