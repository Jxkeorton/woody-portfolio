import type { ProjectSummary } from '../../utils/project.types';

export const one: ProjectSummary = {
	title: 'Practical vehicle design',
	slug: 'practical-vehicle-design',
	system: 'Steering',
	year: '2025',
	context: 'Group project, team of six',
};

export const two: ProjectSummary = {
	title: 'Turbo response mapping',
	slug: 'turbo-response-mapping',
	system: 'Powertrain',
	year: '2024',
	context: 'Final-year project',
};

export const longTitle: ProjectSummary = {
	...one,
	slug: 'long-title',
	title:
		'A very long project title that an editor might plausibly write when describing a multi-stage thermal and structural study',
};

export const projects = [one, two];
