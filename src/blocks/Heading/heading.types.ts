export interface HeadingBlock {
	_type: 'heading';
	_key: string;
	text: string;
	/** 'section' renders an h2, 'subsection' an h3. Defaults to 'section'. */
	level?: 'section' | 'subsection';
}
