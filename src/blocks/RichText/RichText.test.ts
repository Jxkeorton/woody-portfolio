import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import RichText from './RichText.astro';
import type { RichTextBlock } from './richText.types';
import { blank, empty, full, longParagraph, minimal, twoParagraphs } from './richText.fixture';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (props: Pick<RichTextBlock, 'body'>) =>
	container.renderToString(RichText, { props });

const tags = (html: string, tag: string) =>
	[...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) =>
		m[1]!.replace(/<[^>]*>/g, '').trim(),
	);

describe('Rich text block', () => {
	describe('given one paragraph', () => {
		it('shows the paragraph text', async () => {
			expect(tags(await render(minimal), 'p')).toEqual(['A single paragraph about the project.']);
		});
	});

	describe('given several paragraphs', () => {
		it('shows each paragraph, in order', async () => {
			expect(tags(await render(twoParagraphs), 'p')).toEqual([
				'First paragraph.',
				'Second paragraph.',
			]);
		});
	});

	describe('given bold, italic and a link', () => {
		it('shows the bold and italic text as emphasis', async () => {
			const html = await render(full);
			expect(tags(html, 'strong')).toEqual(['laser-cut gears']);
			expect(tags(html, 'em')).toEqual(['high friction']);
		});

		it('shows the link with its text and destination', async () => {
			expect(await render(full)).toMatch(
				/<a[^>]*href="https:\/\/example\.com\/report"[^>]*>lab report<\/a>/,
			);
		});
	});

	describe('given bullet and numbered lists', () => {
		it('shows a bullet list and a numbered list with their items', async () => {
			const html = await render(full);
			expect(tags(html, 'ul')).toHaveLength(1);
			expect(tags(html, 'ol')).toHaveLength(1);
			expect(tags(html, 'li')).toEqual([
				'Measured the gear modulus',
				'Compared friction coefficients',
				'Redesign the gear train',
				'Retest on the slalom course',
			]);
		});
	});

	describe('given a very long paragraph', () => {
		it('shows all of the text', async () => {
			const text = longParagraph.body[0]!.children.map((c) => ('text' in c ? c.text : '')).join('');
			expect(tags(await render(longParagraph), 'p')[0]).toBe(text.trim());
		});
	});

	describe('given only an empty paragraph', () => {
		it('renders nothing, so there is no empty paragraph for screen readers', async () => {
			expect((await render(blank)).trim()).toBe('');
		});
	});

	describe('given no text', () => {
		it('renders nothing, so there is no empty wrapper', async () => {
			expect((await render(empty)).trim()).toBe('');
		});
	});
});
