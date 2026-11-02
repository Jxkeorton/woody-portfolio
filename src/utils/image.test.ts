import { describe, expect, it } from 'vitest';
import { croppedDimensions, imageSizes, objectPosition, srcSetWidths } from './image';

describe('Image dimensions', () => {
	describe('given an image with no crop', () => {
		it('uses the original width and height', () => {
			expect(croppedDimensions({ width: 1600, height: 900 })).toEqual({ width: 1600, height: 900 });
		});
	});

	describe('given a crop', () => {
		it('removes the cropped fraction from each side', () => {
			expect(
				croppedDimensions(
					{ width: 2000, height: 1000 },
					{ top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 },
				),
			).toEqual({ width: 1000, height: 800 });
		});
	});
});

describe('Image focal point', () => {
	describe('given a hotspot', () => {
		it('positions the image on the hotspot as percentages', () => {
			expect(objectPosition({ x: 0.25, y: 0.8 })).toBe('25% 80%');
		});
	});

	describe('given no hotspot', () => {
		it('leaves the browser default', () => {
			expect(objectPosition(undefined)).toBeUndefined();
		});
	});
});

describe('Responsive image widths', () => {
	describe('given a large original', () => {
		it('offers several widths, smallest first, up to the original', () => {
			const widths = srcSetWidths(1800);
			expect(widths).toEqual([...widths].sort((a, b) => a - b));
			expect(widths.length).toBeGreaterThan(2);
			expect(Math.max(...widths)).toBe(1800);
		});
	});

	describe('given a small original', () => {
		it('never asks for more pixels than the original has', () => {
			expect(srcSetWidths(500).every((w) => w <= 500)).toBe(true);
		});
	});
});

describe('Image sizes hint', () => {
	it('says a full-width image fills the viewport', () => {
		expect(imageSizes('full', 1)).toBe('100vw');
	});

	it('says one inset image is narrower than the viewport on wide screens', () => {
		expect(imageSizes('inset', 1)).toMatch(/min-width.*rem\)/);
	});

	it('shares the width between images in a set on wide screens', () => {
		expect(imageSizes('wide', 3)).toContain('33vw');
	});
});
