import { sanityClient } from 'sanity:client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { defineQuery } from 'groq';
import type { Block, Project, ProjectSummary } from './project.types';
import { resolveCv } from './cv';
import type { RawCv } from './cv.types';
import { resolveSiteSettings } from './siteSettings';
import type { RawSiteSettings } from './siteSettings.types';

const builder = createImageUrlBuilder(sanityClient);

type ImageSource = Parameters<typeof builder.image>[0];

export const imageUrl = (
	source: ImageSource,
	{ width, height }: { width: number; height?: number },
) => {
	const image = builder.image(source).width(width).auto('format');
	return (height ? image.height(height) : image).url();
};

export const imageSrcSet = (source: ImageSource, widths: number[]) =>
	widths.map((width) => `${imageUrl(source, { width })} ${width}w`).join(', ');

export const PROJECTS_QUERY =
	defineQuery(`*[_type == "project" && defined(slug.current)] | order(coalesce(orderRank, "~") asc, year desc, title asc){
	title,
	"slug": slug.current,
	system,
	year,
	context,
	cover{
		alt,
		hotspot,
		crop,
		asset->{ _id, metadata { lqip, dimensions { width, height } } }
	}
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
		_type == "heading" => { text, level },
		_type == "richText" => { body },
		_type == "imageSet" => {
			layout,
			images[]{
				_key,
				alt,
				caption,
				hotspot,
				crop,
				asset->{ _id, metadata { lqip, dimensions { width, height } } }
			}
		}
	}
}`);

type RawProject = Omit<Project, 'blocks'> & { blocks: Block[] | null };

/** Sanity returns null for an array that has never been set; pages expect a list. */
export const toProject = (raw: RawProject | null): Project | null =>
	raw ? { ...raw, blocks: raw.blocks ?? [] } : null;

export const getProjects = () => sanityClient.fetch<ProjectSummary[]>(PROJECTS_QUERY);

export const getProject = async (slug: string) =>
	toProject(await sanityClient.fetch<RawProject | null>(PROJECT_QUERY, { slug }));

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
	name,
	statement,
	details[]{ _key, label, value },
	skills,
	roleLine,
	availabilityLine,
	about,
	profileImage{
		alt,
		hotspot,
		crop,
		asset->{ _id, metadata { lqip, dimensions { width, height } } }
	},
	email,
	contactHeading,
	siteTitle,
	siteDescription
}`);

export const getSiteSettings = async () =>
	resolveSiteSettings(await sanityClient.fetch<RawSiteSettings | null>(SITE_SETTINGS_QUERY));

export const CV_QUERY = defineQuery(`*[_type == "cv"][0]{
	experience[]{ _key, role, organisation, period, location, description },
	qualifications[]{ _key, qualification, institution, period, grade, detail },
	"cvFile": cvFile.asset->{ url, size }
}`);

export const getCv = async () => resolveCv(await sanityClient.fetch<RawCv | null>(CV_QUERY));
