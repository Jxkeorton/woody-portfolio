import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

// Documents there is only one of. They get a fixed entry in the Studio and cannot be created, duplicated or deleted.
const singletons = [
	{ type: 'siteSettings', title: 'Site settings' },
	{ type: 'cv', title: 'Experience and education' },
];
const singletonTypes = singletons.map(({ type }) => type);
// Document types that get their own drag-and-drop list instead of the default one.
const orderableTypes = ['project'];

export default defineConfig({
	name: 'default',
	title: 'Portfolio',
	projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'placeholder',
	dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
	plugins: [
		structureTool({
			structure: (S, context) =>
				S.list()
					.title('Content')
					.items([
						...singletons.map(({ type, title }) =>
							S.listItem()
								.title(title)
								.id(type)
								.child(S.document().schemaType(type).documentId(type)),
						),
						S.divider(),
						orderableDocumentListDeskItem({ type: 'project', title: 'Projects', S, context }),
						...S.documentTypeListItems().filter(
							(item) => ![...singletonTypes, ...orderableTypes].includes(item.getId() ?? ''),
						),
					]),
		}),
		visionTool(),
	],
	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
	},
	document: {
		actions: (actions, { schemaType }) =>
			singletonTypes.includes(schemaType)
				? actions.filter(
						({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action),
					)
				: actions,
	},
});
