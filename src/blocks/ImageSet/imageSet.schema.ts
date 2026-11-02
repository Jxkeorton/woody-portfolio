import { defineArrayMember, defineField, defineType } from 'sanity';

export const imageSet = defineType({
	name: 'imageSet',
	title: 'Images',
	type: 'object',
	description: 'One to three images, each with a caption.',
	fields: [
		defineField({
			name: 'images',
			title: 'Images',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'image',
					options: { hotspot: true },
					fields: [
						defineField({
							name: 'alt',
							title: 'Alt text',
							description:
								'Describe what the image shows for people who cannot see it, for example "Section view of the gear train".',
							type: 'string',
							validation: (rule) => rule.required().max(200),
						}),
						defineField({
							name: 'caption',
							title: 'Caption',
							description: 'Optional. Shown under the image.',
							type: 'string',
							validation: (rule) => rule.max(200),
						}),
					],
					preview: {
						select: { title: 'alt', subtitle: 'caption', media: 'asset' },
					},
				}),
			],
			validation: (rule) => rule.required().min(1).max(3),
		}),
		defineField({
			name: 'layout',
			title: 'Width',
			description:
				'Inset lines up with the text. Wide uses the full page width. Full goes edge to edge.',
			type: 'string',
			options: {
				list: [
					{ title: 'Inset', value: 'inset' },
					{ title: 'Wide', value: 'wide' },
					{ title: 'Full', value: 'full' },
				],
				layout: 'radio',
			},
			initialValue: 'inset',
		}),
	],
	preview: {
		select: { images: 'images', media: 'images.0.asset', layout: 'layout' },
		prepare: ({ images, media, layout }) => {
			const count = Array.isArray(images) ? images.length : 0;
			return {
				title: `${count} ${count === 1 ? 'image' : 'images'}`,
				subtitle: layout ? `${layout[0].toUpperCase()}${layout.slice(1)} width` : 'Inset width',
				media,
			};
		},
	},
});
