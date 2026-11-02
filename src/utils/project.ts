import type { ProjectSummary } from './project.types';

/** The project after this one in the list, wrapping round to the first. Null when there is nowhere else to go. */
export const nextProject = (projects: ProjectSummary[], slug: string): ProjectSummary | null => {
	const index = projects.findIndex((project) => project.slug === slug);
	if (index === -1 || projects.length < 2) return null;
	return projects[(index + 1) % projects.length] ?? null;
};
