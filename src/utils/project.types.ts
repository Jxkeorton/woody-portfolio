import type { HeadingBlock } from '../blocks/Heading/heading.types';

export type Block = HeadingBlock;

/** What the project list needs. */
export interface ProjectSummary {
	title: string;
	slug: string;
	system: string;
	year: string;
	context: string;
}

export interface Project extends ProjectSummary {
	blocks: Block[];
}
