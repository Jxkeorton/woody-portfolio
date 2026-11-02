import type { HeadingBlock } from './heading.types';

export const full: HeadingBlock = {
	_type: 'heading',
	_key: 'heading-full',
	text: 'Steering geometry',
	level: 'section',
};

export const subsection: HeadingBlock = {
	_type: 'heading',
	_key: 'heading-sub',
	text: 'Ackermann angle',
	level: 'subsection',
};

export const minimal: HeadingBlock = {
	_type: 'heading',
	_key: 'heading-min',
	text: 'Results',
};

export const long: HeadingBlock = {
	_type: 'heading',
	_key: 'heading-long',
	text: 'Why the wooden laser-cut gears stalled under load and what a larger gear modulus would have changed',
};

export const empty: HeadingBlock = {
	_type: 'heading',
	_key: 'heading-empty',
	text: '',
};
