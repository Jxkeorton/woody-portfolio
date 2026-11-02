import type { SchemaTypeDefinition } from 'sanity';
import { heading } from '../../src/blocks/Heading/heading.schema';
import { project } from './project';

// Each block's schema lives in src/blocks/<BlockName>/ and is added here when the block is built.
const blockSchemas: SchemaTypeDefinition[] = [heading];

export const schemaTypes: SchemaTypeDefinition[] = [project, ...blockSchemas];
