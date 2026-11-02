import type { SchemaTypeDefinition } from 'sanity';
import { heading } from '../../src/blocks/Heading/heading.schema';
import { imageSet } from '../../src/blocks/ImageSet/imageSet.schema';
import { richText } from '../../src/blocks/RichText/richText.schema';
import { project } from './project';

// Each block's schema lives in src/blocks/<BlockName>/ and is added here when the block is built.
const blockSchemas: SchemaTypeDefinition[] = [heading, richText, imageSet];

export const schemaTypes: SchemaTypeDefinition[] = [project, ...blockSchemas];
