import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (name: string) => readFileSync(new URL(`../public/${name}`, import.meta.url));
const pngSize = (file: Buffer) => ({ width: file.readUInt32BE(16), height: file.readUInt32BE(20) });

describe('Public assets', () => {
	describe('the favicon', () => {
		const svg = read('favicon.svg').toString();

		it('is the header logo: a green circle with a paper-coloured W', () => {
			expect(svg).toContain('<circle');
			expect(svg).toContain('#0f4a35');
			expect(svg).toContain('#f5f3ec');
		});

		it('does not depend on a font being installed', () => {
			expect(svg).not.toContain('<text');
		});

		it('has an ICO fallback that holds 16 and 32 pixel icons', () => {
			const ico = read('favicon.ico');
			expect(ico.readUInt16LE(0)).toBe(0);
			expect(ico.readUInt16LE(2)).toBe(1);
			expect(ico.readUInt16LE(4)).toBe(2);
		});
	});

	describe('the touch icon', () => {
		it('is a 180 by 180 PNG', () => {
			expect(pngSize(read('apple-touch-icon.png'))).toEqual({ width: 180, height: 180 });
		});
	});

	describe('the share image', () => {
		it('is a 1200 by 630 PNG', () => {
			expect(pngSize(read('og-image.png'))).toEqual({ width: 1200, height: 630 });
		});
	});
});
