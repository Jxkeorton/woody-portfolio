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
			name: 'blocks',
			title: 'Page content',
			description: 'Build the project page from these parts. Drag to reorder.',
			type: 'array',
			of: [{ type: 'heading' }],
		}),
	],
	preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
