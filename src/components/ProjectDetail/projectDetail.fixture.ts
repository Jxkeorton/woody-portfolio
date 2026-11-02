import type { Project } from '../../data/project.types';

export const minimalProject: Project = {
	id: 'minimal',
	title: 'Minimal project',
	system: 'Brakes',
	discipline: 'Coursework',
	year: '2024',
	figures: [{ variant: 'rotor', caption: 'Rotor, front view' }],
	paragraphs: ['A single paragraph about the project.'],
};

export const fullProject: Project = {
	id: 'full',
	title: 'Ventilated brake rotor',
	system: 'Brakes',
	discipline: 'Formula Student team',
	year: '2025',
	figures: [
		{ variant: 'rotor', caption: 'Rotor, front view. Ø 340 mm' },
		{ variant: 'curve', caption: 'Temperature against time' },
	],
	paragraphs: [
		'Paragraph one.',
		'Paragraph two.',
		'Paragraph three.',
		'Paragraph four.',
		'Paragraph five.',
		'Paragraph six.',
	],
};

export const longTitleProject: Project = {
	...minimalProject,
	id: 'long-title',
	title:
		'A very long project title that an editor might plausibly write when describing a multi-stage thermal and structural study',
};
