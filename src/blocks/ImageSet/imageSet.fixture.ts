import type { ImageSetBlock, SetImage } from './imageSet.types';

const image = (key: string, overrides: Partial<SetImage> = {}): SetImage => ({
	_key: key,
	alt: `Alt text for ${key}`,
	asset: {
		_id: `image-${key}000000000000000000000000-1600x900-jpg`,
		metadata: { lqip: 'data:image/jpeg;base64,/9j/lqip', dimensions: { width: 1600, height: 900 } },
	},
	...overrides,
});

export const minimal: ImageSetBlock = {
	_type: 'imageSet',
	_key: 'set-min',
	images: [image('one')],
};

export const full: ImageSetBlock = {
	_type: 'imageSet',
	_key: 'set-full',
	layout: 'wide',
	images: [
		image('one', {
			caption: 'Gear train, schematic',
			hotspot: { x: 0.25, y: 0.8, width: 0.5, height: 0.5 },
		}),
		image('two', { caption: 'Drivetrain, section view' }),
		image('three', {
			alt: 'Portrait photo of the finished car',
			asset: {
				_id: 'image-three000000000000000000000000-900x1200-jpg',
				metadata: { dimensions: { width: 900, height: 1200 } },
			},
		}),
	],
};

export const longCaption: ImageSetBlock = {
	_type: 'imageSet',
	_key: 'set-long',
	images: [
		image('one', {
			caption:
				'A long caption that an editor might write to explain the test set-up in detail, including the rig, the sensors and the conditions on the day. '.repeat(
					2,
				),
		}),
	],
};

export const cropped: ImageSetBlock = {
	_type: 'imageSet',
	_key: 'set-crop',
	images: [image('one', { crop: { top: 0, bottom: 0, left: 0.25, right: 0.25 } })],
};

export const empty: ImageSetBlock = { _type: 'imageSet', _key: 'set-empty', images: [] };
