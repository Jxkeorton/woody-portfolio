import type { SchemaTypeDefinition } from 'sanity';
import { project } from './project';

// Each block's schema lives in src/blocks/<BlockName>/ and is added here when the block is built.
const blockSchemas: SchemaTypeDefinition[] = [];

export const schemaTypes: SchemaTypeDefinition[] = [project, ...blockSchemas];
