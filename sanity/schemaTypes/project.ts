import { defineField, defineType } from 'sanity';

export const project = defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required().max(120),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'system',
			title: 'System',
			description: 'The part of the vehicle this is about, for example Steering or Powertrain.',
			type: 'string',
			validation: (rule) => rule.required().max(40),
		}),
		defineField({
			name: 'year',
			title: 'Year',
			type: 'string',
			validation: (rule) => rule.required().max(9),
		}),
		defineField({
			name: 'context',
			title: 'Context',
			description:
				'One line on what kind of project this was, for example Group project, team of six.',
			type: 'string',
			validation: (rule) => rule.required().max(120),
		}),
		defineField({
			name: 'cover',
			title: 'Cover image',
			description:
				'Shown beside the project list on the home page when someone points at this project. Landscape works best.',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alt text',
					description: 'Describe what the image shows for people who cannot see it.',
					type: 'string',
					validation: (rule) => rule.required().max(200),
				}),
			],
		}),
		defineField({
			name: 'blocks',
			title: 'Page content',
			description: 'Build the project page from these parts. Drag to reorder.',
			type: 'array',
			of: [{ type: 'heading' }, { type: 'richText' }, { type: 'imageSet' }],
		}),
	],
	preview: { select: { title: 'title', subtitle: 'slug.current', media: 'cover' } },
});
