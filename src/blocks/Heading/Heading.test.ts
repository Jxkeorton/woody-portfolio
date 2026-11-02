import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Heading from './Heading.astro';
import type { HeadingBlock } from './heading.types';
import { empty, full, long, minimal, subsection } from './heading.fixture';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (props: Pick<HeadingBlock, 'text' | 'level'>) =>
	container.renderToString(Heading, { props });

const headings = (html: string) =>
	[...html.matchAll(/<h([1-6])[^>]*>([^<]*)<\/h\1>/g)].map((m) => ({
		level: Number(m[1]),
		text: m[2],
	}));

describe('Heading block', () => {
	describe('given a section heading', () => {
		it('shows its text as a level 2 heading', async () => {
			expect(headings(await render(full))).toEqual([{ level: 2, text: 'Steering geometry' }]);
		});
	});

	describe('given a sub-section heading', () => {
		it('shows its text as a level 3 heading', async () => {
			expect(headings(await render(subsection))).toEqual([{ level: 3, text: 'Ackermann angle' }]);
		});
	});

	describe('given no level', () => {
		it('shows a level 2 heading', async () => {
			expect(headings(await render(minimal))).toEqual([{ level: 2, text: 'Results' }]);
		});
	});

	describe('given a very long heading', () => {
		it('shows the whole text', async () => {
			expect(headings(await render(long))[0]?.text).toBe(long.text);
		});
	});

	describe('given empty text', () => {
		it('renders no heading, so there is no empty landmark for screen readers', async () => {
			const html = await render(empty);
			expect(headings(html)).toEqual([]);
			expect(html.trim()).toBe('');
		});
	});
});
