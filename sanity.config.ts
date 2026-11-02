import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
	name: 'default',
	title: 'Portfolio',
	projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'placeholder',
	dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
	plugins: [
		structureTool({
			structure: (S) =>
				S.list()
					.title('Content')
					.items([
						S.listItem()
							.title('Site settings')
							.id('siteSettings')
							.child(S.document().schemaType('siteSettings').documentId('siteSettings')),
						S.divider(),
						...S.documentTypeListItems().filter((item) => item.getId() !== 'siteSettings'),
					]),
		}),
		visionTool(),
	],
	schema: {
		types: schemaTypes,
		templates: (templates) => templates.filter(({ schemaType }) => schemaType !== 'siteSettings'),
	},
	document: {
		actions: (actions, { schemaType }) =>
			schemaType === 'siteSettings'
				? actions.filter(
						({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action),
					)
				: actions,
	},
});
