export interface Dimensions {
	width: number;
	height: number;
}

interface Crop {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

/** The size an image is shown at once Sanity's crop is applied. */
export const croppedDimensions = ({ width, height }: Dimensions, crop?: Crop): Dimensions =>
	crop
		? {
				width: Math.round(width * (1 - crop.left - crop.right)),
				height: Math.round(height * (1 - crop.top - crop.bottom)),
			}
		: { width, height };

/** CSS `object-position` that keeps the editor's hotspot in view. */
export const objectPosition = (hotspot?: { x: number; y: number }) =>
	hotspot
		? `${Math.round(hotspot.x * 1000) / 10}% ${Math.round(hotspot.y * 1000) / 10}%`
		: undefined;

const CANDIDATE_WIDTHS = [480, 800, 1200, 1600, 2000];
const MAX_WIDTH = 2400;

/** Widths to offer in a srcset, never more pixels than the original has. */
export const srcSetWidths = (originalWidth: number) => [
	...CANDIDATE_WIDTHS.filter((width) => width < originalWidth),
	Math.min(originalWidth, MAX_WIDTH),
];

/** The `sizes` hint: how wide the browser will draw each image at different screen widths. */
export const imageSizes = (layout: 'inset' | 'wide' | 'full', count: number) => {
	if (count > 1) return `(min-width: 40rem) ${Math.floor(100 / count)}vw, 100vw`;
	if (layout === 'full') return '100vw';
	if (layout === 'wide') return '(min-width: 72rem) 68rem, 100vw';
	return '(min-width: 48rem) 48rem, 100vw';
};
