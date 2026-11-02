import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ImageSet from './ImageSet.astro';
import type { ImageSetBlock } from './imageSet.types';
import { cropped, empty, full, longCaption, minimal } from './imageSet.fixture';

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (props: Pick<ImageSetBlock, 'images' | 'layout'>) =>
	container.renderToString(ImageSet, { props });

const imgs = (html: string) =>
	[...html.matchAll(/<img\b([^>]*)>/g)].map((m) => {
		const attrs = m[1]!;
		const get = (name: string) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
		return {
			alt: get('alt'),
			width: get('width'),
			height: get('height'),
			loading: get('loading'),
			src: get('src'),
			srcset: get('srcset'),
			sizes: get('sizes'),
			style: get('style'),
		};
	});

describe('Image set block', () => {
	describe('given one image with no caption', () => {
		it('shows the image with its alt text and no caption', async () => {
			const html = await render(minimal);
			expect(imgs(html).map((i) => i.alt)).toEqual(['Alt text for one']);
			expect(html).not.toContain('<figcaption');
		});
	});

	describe('given three images with captions', () => {
		it('shows each image in order, with its alt text', async () => {
			const html = await render(full);
			expect(imgs(html).map((i) => i.alt)).toEqual([
				'Alt text for one',
				'Alt text for two',
				'Portrait photo of the finished car',
			]);
		});

		it('shows a caption only under the images that have one', async () => {
			const html = await render(full);
			expect(html.match(/<figcaption/g)).toHaveLength(2);
			expect(html).toContain('Gear train, schematic');
			expect(html).toContain('Drivetrain, section view');
		});

		it('keeps each image with its caption in one figure', async () => {
			expect((await render(full)).match(/<figure[\s>]/g)).toHaveLength(3);
		});
	});

	describe('given any image', () => {
		it('reserves space with the real width and height so the page does not jump', async () => {
			const [a, , portrait] = imgs(await render(full));
			expect([a!.width, a!.height]).toEqual(['1600', '900']);
			expect([portrait!.width, portrait!.height]).toEqual(['900', '1200']);
		});

		it('loads lazily and offers several sizes', async () => {
			const [first] = imgs(await render(minimal));
			expect(first!.loading).toBe('lazy');
			expect(first!.srcset!.split(',').length).toBeGreaterThan(1);
			expect(first!.sizes).toBeTruthy();
		});

		it('shows the low-quality preview colour while the image loads', async () => {
			expect(imgs(await render(minimal))[0]!.style).toContain('data:image/jpeg;base64,/9j/lqip');
		});
	});

	describe('given an image from the Sanity library', () => {
		it('serves it from the Sanity CDN in an automatic format', async () => {
			const url = new URL(imgs(await render(minimal))[0]!.src!.replace(/&amp;/g, '&'));
			expect(url.hostname).toBe('cdn.sanity.io');
			expect(url.pathname).toContain('-1600x900.jpg');
			expect(url.searchParams.get('auto')).toBe('format');
		});
	});

	describe('given a hotspot', () => {
		it('keeps the hotspot in view when the image is cropped to fit', async () => {
			expect(imgs(await render(full))[0]!.style).toContain('object-position: 25% 80%');
		});
	});

	describe('given a crop', () => {
		it('reserves space for the cropped size, not the original', async () => {
			const [img] = imgs(await render(cropped));
			expect([img!.width, img!.height]).toEqual(['800', '900']);
			expect(img!.src!.replace(/&amp;/g, '&')).toContain('rect=400,0,800,900');
		});
	});

	describe('given a very long caption', () => {
		it('shows the whole caption', async () => {
			const caption = longCaption.images[0]!.caption!.trim();
			expect(await render(longCaption)).toContain(caption);
		});
	});

	describe('given a layout', () => {
		it('applies the chosen layout', async () => {
			expect(await render(full)).toContain('data-layout="wide"');
		});

		it('defaults to an inset layout', async () => {
			expect(await render(minimal)).toContain('data-layout="inset"');
		});
	});

	describe('given no images', () => {
		it('renders nothing', async () => {
			expect((await render(empty)).trim()).toBe('');
		});
	});
});
