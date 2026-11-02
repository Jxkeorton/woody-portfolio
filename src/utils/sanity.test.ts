import { describe, expect, it } from 'vitest';
import { PROJECTS_QUERY, PROJECT_QUERY, imageUrl, toProject } from './sanity';

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

		it('fetches the ordered blocks array with each block type and key', () => {
			expect(PROJECT_QUERY).toContain('blocks[]');
			expect(PROJECT_QUERY).toContain('_type');
			expect(PROJECT_QUERY).toContain('_key');
		});

		it('fetches the heading fields for heading blocks', () => {
			expect(PROJECT_QUERY).toContain('_type == "heading" => { text, level }');
		});

		it('fetches the body for rich text blocks', () => {
			expect(PROJECT_QUERY).toContain('_type == "richText" => { body }');
		});

		it('fetches the layout and each image with its alt, caption, focal point and size for image sets', () => {
			expect(PROJECT_QUERY).toContain('_type == "imageSet"');
			for (const field of ['layout', 'alt', 'caption', 'hotspot', 'crop', 'lqip', 'dimensions']) {
				expect(PROJECT_QUERY).toContain(field);
			}
		});

		it('fetches the details shown in the page title block', () => {
			for (const field of ['system', 'year', 'context']) {
				expect(PROJECT_QUERY).toContain(field);
			}
		});
	});

	describe('given the projects query', () => {
		it('fetches only published projects that have a slug', () => {
			expect(PROJECTS_QUERY).toContain('_type == "project"');
			expect(PROJECTS_QUERY).toContain('defined(slug.current)');
		});

		it('fetches only what the list and page paths need', () => {
			for (const field of ['title', '"slug": slug.current', 'system', 'year', 'context']) {
				expect(PROJECTS_QUERY).toContain(field);
			}
			expect(PROJECTS_QUERY).not.toContain('blocks');
		});

		it('fetches the cover image with its alt text, focal point and size', () => {
			expect(PROJECTS_QUERY).toContain('cover{');
			for (const field of ['alt', 'hotspot', 'crop', 'lqip', 'dimensions']) {
				expect(PROJECTS_QUERY).toContain(field);
			}
		});

		it('lists the newest projects first', () => {
			expect(PROJECTS_QUERY).toContain('order(year desc');
		});
	});
});

describe('Sanity project data', () => {
	const raw = {
		title: 'T',
		slug: 's',
		system: 'Brakes',
		year: '2025',
		context: 'C',
		blocks: null,
	};

	describe('given no project', () => {
		it('returns null', () => {
			expect(toProject(null)).toBeNull();
		});
	});

	describe('given a project whose blocks have never been set', () => {
		it('treats the blocks as an empty list', () => {
			expect(toProject(raw)?.blocks).toEqual([]);
		});
	});

	describe('given a project with blocks', () => {
		it('keeps them in order', () => {
			const blocks = [
				{ _type: 'heading' as const, _key: 'a', text: 'One' },
				{ _type: 'heading' as const, _key: 'b', text: 'Two' },
			];
			expect(toProject({ ...raw, blocks })?.blocks).toEqual(blocks);
		});
	});
});
