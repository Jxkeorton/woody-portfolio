import type { HeadingBlock } from '../blocks/Heading/heading.types';
import type { ImageSetBlock } from '../blocks/ImageSet/imageSet.types';
import type { RichTextBlock } from '../blocks/RichText/richText.types';

export type Block = HeadingBlock | RichTextBlock | ImageSetBlock;

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
