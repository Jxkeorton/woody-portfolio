import type { CoverImage, ProjectSummary } from '../../utils/project.types';

export const cover: CoverImage = {
	alt: 'Gear train, section view',
	hotspot: { x: 0.25, y: 0.8, width: 0.5, height: 0.5 },
	asset: {
		_id: 'image-cover000000000000000000000000-1600x900-jpg',
		metadata: { lqip: 'data:image/jpeg;base64,/9j/lqip', dimensions: { width: 1600, height: 900 } },
	},
};

export const one: ProjectSummary = {
	title: 'Practical vehicle design',
	slug: 'practical-vehicle-design',
	system: 'Steering',
	year: '2025',
	context: 'Group project, team of six',
	cover,
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

/** Six projects, enough to need the home page's limit. */
export const sixProjects: ProjectSummary[] = [1, 2, 3, 4, 5, 6].map((n) => ({
	...one,
	slug: `project-${n}`,
	title: `Project ${n}`,
}));
