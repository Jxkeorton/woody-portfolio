import { defineField, defineType } from 'sanity';

export const heading = defineType({
	name: 'heading',
	title: 'Heading',
	type: 'object',
	description: 'A heading that starts a new part of the project page.',
	fields: [
		defineField({
			name: 'text',
			title: 'Heading text',
			type: 'string',
			validation: (rule) => rule.required().max(80),
		}),
		defineField({
			name: 'level',
			title: 'Size',
			description: 'Section for a main part of the page. Sub-section for a smaller part inside it.',
			type: 'string',
			options: {
				list: [
					{ title: 'Section', value: 'section' },
					{ title: 'Sub-section', value: 'subsection' },
				],
				layout: 'radio',
			},
			initialValue: 'section',
		}),
	],
	preview: {
		select: { title: 'text', subtitle: 'level' },
		prepare: ({ title, subtitle }) => ({
			title: title ?? 'Heading',
			subtitle: subtitle === 'subsection' ? 'Sub-section heading' : 'Section heading',
		}),
	},
});
