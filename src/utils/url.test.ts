import { describe, expect, it } from 'vitest';
import { absoluteUrl } from './url';

describe('Absolute URLs', () => {
	describe('given the address of the site', () => {
		it('puts the address in front of the path', () => {
			expect(absoluteUrl('/og-image.png', 'https://woody.example')).toBe(
				'https://woody.example/og-image.png',
			);
		});

		it('does not double up a trailing slash on the address', () => {
			expect(absoluteUrl('/projects/a', 'https://woody.example/')).toBe(
				'https://woody.example/projects/a',
			);
		});
	});

	describe('given no address for the site', () => {
		it('keeps the path as it is', () => {
			expect(absoluteUrl('/og-image.png')).toBe('/og-image.png');
		});
	});
});
