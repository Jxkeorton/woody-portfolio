export interface SetImage {
	_key: string;
	/** Describes the image for people who cannot see it. Required in the schema. */
	alt: string;
	caption?: string;
	hotspot?: { x: number; y: number; width: number; height: number };
	crop?: { top: number; bottom: number; left: number; right: number };
	asset: {
		_id: string;
		metadata: { lqip?: string; dimensions: { width: number; height: number } };
	};
}

export interface ImageSetBlock {
	_type: 'imageSet';
	_key: string;
	/** One to three images. */
	images: SetImage[];
	/** Defaults to 'inset'. */
	layout?: 'inset' | 'wide' | 'full';
}
