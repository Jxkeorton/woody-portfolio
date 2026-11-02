import { sanityClient } from 'sanity:client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { defineQuery } from 'groq';

const builder = createImageUrlBuilder(sanityClient);

type ImageSource = Parameters<typeof builder.image>[0];

export const imageUrl = (
	source: ImageSource,
	{ width, height }: { width: number; height?: number },
) => {
	const image = builder.image(source).width(width).auto('format');
	return (height ? image.height(height) : image).url();
};

export const PROJECT_IDS_QUERY = defineQuery(`*[_type == "project" && defined(slug.current)]{
	"slug": slug.current
}`);

export const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
	title,
	"slug": slug.current,
	system,
	year,
	context,
	blocks[]{
		_type,
		_key,
		_type == "heading" => { text, level }
	}
}`);

export const getProjectSlugs = () => sanityClient.fetch(PROJECT_IDS_QUERY);

export const getProject = (slug: string) => sanityClient.fetch(PROJECT_QUERY, { slug });
