import type { Block } from 'astro-portabletext/types';
import type { RichTextBlock } from './richText.types';

const span = (key: string, text: string, marks: string[] = []) => ({
	_type: 'span' as const,
	_key: key,
	text,
	marks,
});

const paragraph = (
	key: string,
	children: ReturnType<typeof span>[],
	markDefs: Block['markDefs'] = [],
): Block => ({
	_type: 'block',
	_key: key,
	style: 'normal',
	children,
	markDefs,
});

const listItem = (key: string, text: string, listItem: 'bullet' | 'number'): Block => ({
	...paragraph(key, [span(`${key}-s`, text)]),
	listItem,
	level: 1,
});

export const minimal: RichTextBlock = {
	_type: 'richText',
	_key: 'text-min',
	body: [paragraph('p1', [span('p1-s', 'A single paragraph about the project.')])],
};

export const twoParagraphs: RichTextBlock = {
	_type: 'richText',
	_key: 'text-two',
	body: [
		paragraph('p1', [span('p1-s', 'First paragraph.')]),
		paragraph('p2', [span('p2-s', 'Second paragraph.')]),
	],
};

export const full: RichTextBlock = {
	_type: 'richText',
	_key: 'text-full',
	body: [
		paragraph(
			'p1',
			[
				span('a', 'The car used '),
				span('b', 'laser-cut gears', ['strong']),
				span('c', ', which showed '),
				span('d', 'high friction', ['em']),
				span('e', '. See the '),
				span('f', 'lab report', ['link1']),
				span('g', '.'),
			],
			[{ _type: 'link', _key: 'link1', href: 'https://example.com/report' }],
		),
		listItem('l1', 'Measured the gear modulus', 'bullet'),
		listItem('l2', 'Compared friction coefficients', 'bullet'),
		listItem('n1', 'Redesign the gear train', 'number'),
		listItem('n2', 'Retest on the slalom course', 'number'),
	],
};

export const longParagraph: RichTextBlock = {
	_type: 'richText',
	_key: 'text-long',
	body: [
		paragraph('p1', [
			span(
				'p1-s',
				'Supercalifragilisticexpialidocious_'.repeat(8) +
					' and then a long run of words that keeps going. '.repeat(10),
			),
		]),
	],
};

export const empty: RichTextBlock = { _type: 'richText', _key: 'text-empty', body: [] };

export const blank: RichTextBlock = {
	_type: 'richText',
	_key: 'text-blank',
	body: [paragraph('p1', [span('p1-s', '')])],
};
