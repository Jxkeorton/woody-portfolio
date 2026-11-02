import type { Project } from '../../utils/project.types';

export const minimalProject: Project = {
	title: 'Minimal project',
	slug: 'minimal',
	system: 'Brakes',
	year: '2024',
	context: 'Coursework',
	blocks: [],
};

export const fullProject: Project = {
	title: 'Ventilated brake rotor',
	slug: 'full',
	system: 'Brakes',
	year: '2025',
	context: 'Formula Student team',
	blocks: [
		{ _type: 'heading', _key: 'a', text: 'Thermal model', level: 'section' },
		{ _type: 'heading', _key: 'b', text: 'Boundary conditions', level: 'subsection' },
		{ _type: 'heading', _key: 'c', text: 'Results', level: 'section' },
	],
};

export const longTitleProject: Project = {
	...minimalProject,
	slug: 'long-title',
	title:
		'A very long project title that an editor might plausibly write when describing a multi-stage thermal and structural study',
};
