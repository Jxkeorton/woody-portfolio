import type { Block } from 'astro-portabletext/types';

export interface RichTextBlock {
	_type: 'richText';
	_key: string;
	/** Portable Text: paragraphs, bold, italic, links, bullet and numbered lists. */
	body: Block[];
}
