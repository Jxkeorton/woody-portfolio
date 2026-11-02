import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BlockRenderer from './BlockRenderer.astro';
import { full, subsection } from './Heading/heading.fixture';
import { minimal as textMinimal } from './RichText/richText.fixture';
import type { HeadingBlock } from './Heading/heading.types';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (blocks: { _type: string; _key: string }[]) =>
	container.renderToString(BlockRenderer, { props: { blocks } });

describe('BlockRenderer', () => {
	describe('given no blocks', () => {
		it('renders nothing', async () => {
			expect((await render([])).trim()).toBe('');
		});
	});

	describe('given a block type that has no component', () => {
		it('skips it without failing the page', async () => {
			const html = await render([{ _type: 'doesNotExist', _key: 'a' }]);
			expect(html.trim()).toBe('');
		});
	});

	describe('given a heading block', () => {
		it('renders it using the heading component', async () => {
			const html = await render([full]);
			expect(html).toContain('<h2');
			expect(html).toContain('Steering geometry');
		});
	});

	describe('given several blocks', () => {
		it('renders them in the order given', async () => {
			const blocks: HeadingBlock[] = [subsection, full];
			const html = await render(blocks);
			expect(html.indexOf('Ackermann angle')).toBeLessThan(html.indexOf('Steering geometry'));
		});
	});

	describe('given a text block between two headings', () => {
		it('renders each block in the order given', async () => {
			const html = await render([full, textMinimal, subsection]);
			const heading = html.indexOf('Steering geometry');
			const text = html.indexOf('A single paragraph');
			const sub = html.indexOf('Ackermann angle');
			expect(heading).toBeLessThan(text);
			expect(text).toBeLessThan(sub);
		});
	});
});
