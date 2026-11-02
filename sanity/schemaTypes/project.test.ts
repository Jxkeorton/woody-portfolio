import { describe, expect, it } from 'vitest';
import { project } from './project';

interface FieldDef {
	name: string;
	type: string;
	hidden?: boolean;
}

const fields = (project as unknown as { fields: FieldDef[] }).fields;

describe('Project schema', () => {
	describe('given the project list can be re-ordered in the Studio', () => {
		it('stores each project’s position in a hidden orderRank field', () => {
			const rank = fields.find((f) => f.name === 'orderRank');
			expect(rank?.type).toBe('string');
			expect(rank?.hidden).toBe(true);
		});
	});
});
