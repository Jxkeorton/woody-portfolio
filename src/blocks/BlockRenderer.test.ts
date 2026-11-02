import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BlockRenderer from './BlockRenderer.astro';

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
});
