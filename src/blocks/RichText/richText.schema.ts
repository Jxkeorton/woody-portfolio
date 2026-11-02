import { defineArrayMember, defineField, defineType } from 'sanity';

export const richText = defineType({
	name: 'richText',
	title: 'Text',
	type: 'object',
	description: 'Paragraphs of text, with bold, italic, links and lists.',
	fields: [
		defineField({
			name: 'body',
			title: 'Text',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'block',
					styles: [{ title: 'Normal', value: 'normal' }],
					lists: [
						{ title: 'Bullet list', value: 'bullet' },
						{ title: 'Numbered list', value: 'number' },
					],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' },
						],
						annotations: [
							{
								name: 'link',
								title: 'Link',
								type: 'object',
								fields: [
									defineField({
										name: 'href',
										title: 'Web address',
										description: 'Starts with https://, or mailto: for an email address.',
										type: 'url',
										validation: (rule) =>
											rule.required().uri({ scheme: ['https', 'http', 'mailto'] }),
									}),
								],
							},
						],
					},
				}),
			],
			validation: (rule) => rule.required().min(1),
		}),
	],
	preview: {
		select: { blocks: 'body' },
		prepare: ({ blocks }) => {
			const first = (blocks ?? []).find((block: { _type: string }) => block._type === 'block') as
				| { children?: { text?: string }[] }
				| undefined;
			return {
				title: first?.children?.map((child) => child.text ?? '').join('') || 'Text',
				subtitle: 'Text',
			};
		},
	},
});
