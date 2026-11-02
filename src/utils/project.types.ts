import type { HeadingBlock } from '../blocks/Heading/heading.types';
import type { ImageSetBlock, SetImage } from '../blocks/ImageSet/imageSet.types';
import type { RichTextBlock } from '../blocks/RichText/richText.types';

export type Block = HeadingBlock | RichTextBlock | ImageSetBlock;

/** The image shown for a project in the list. Alt text is required in the Studio. */
export type CoverImage = Omit<SetImage, '_key' | 'caption'>;

/** What the project list needs. */
export interface ProjectSummary {
	title: string;
	slug: string;
	system: string;
	year: string;
	context: string;
	/** Sanity returns null when the editor has not added a cover. */
	cover?: CoverImage | null;
}

export interface Project extends ProjectSummary {
	blocks: Block[];
}
