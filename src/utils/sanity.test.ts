import { describe, expect, it } from 'vitest';
import { PROJECT_IDS_QUERY, PROJECT_QUERY, imageUrl } from './sanity';

const imageSource = {
	_type: 'image',
	asset: { _ref: 'image-abc123-1600x900-jpg', _type: 'reference' },
};

describe('Sanity image URLs', () => {
	describe('given an image source and a width and height', () => {
		const url = new URL(imageUrl(imageSource, { width: 800, height: 450 }));

		it('requests the image at the given width and height', () => {
			expect(url.searchParams.get('w')).toBe('800');
			expect(url.searchParams.get('h')).toBe('450');
		});

		it('serves the image from the Sanity CDN', () => {
			expect(url.hostname).toBe('cdn.sanity.io');
			expect(url.pathname).toContain('abc123-1600x900.jpg');
		});

		it('asks for an automatically chosen modern format', () => {
			expect(url.searchParams.get('auto')).toBe('format');
		});
	});

	describe('given only a width', () => {
		it('does not force a height', () => {
			const url = new URL(imageUrl(imageSource, { width: 800 }));
			expect(url.searchParams.get('w')).toBe('800');
			expect(url.searchParams.has('h')).toBe(false);
		});
	});
});

describe('Sanity queries', () => {
	describe('given the project query', () => {
		it('looks up a project by its slug', () => {
			expect(PROJECT_QUERY).toContain('_type == "project"');
			expect(PROJECT_QUERY).toContain('slug.current == $slug');
		});

		it('fetches the ordered blocks array', () => {
			expect(PROJECT_QUERY).toContain('blocks');
		});
	});

	describe('given the project ids query', () => {
		it('fetches only the slugs needed to build static paths', () => {
			expect(PROJECT_IDS_QUERY).toContain('"slug": slug.current');
		});
	});
});
