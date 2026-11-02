import { describe, expect, it } from 'vitest';
import { cv } from './cv';

interface FieldDef {
	name: string;
	type: string;
	validation?: (rule: unknown) => unknown;
	options?: { accept?: string };
	of?: { fields: FieldDef[] }[];
}

const fields = (cv as unknown as { fields: FieldDef[] }).fields;
const field = (name: string) => fields.find((f) => f.name === name);

/** Records which rules a field's validation asks for. */
const rulesOf = (def: FieldDef | undefined) => {
	const calls: string[] = [];
	const rule: Record<string, (...args: unknown[]) => unknown> = new Proxy(
		{},
		{
			get:
				(_t, key: string) =>
				(...args: unknown[]) => {
					calls.push(args.length ? `${key}(${args.join(',')})` : key);
					return rule;
				},
		},
	);
	def?.validation?.(rule);
	return calls;
};

const entryField = (list: string, name: string) =>
	field(list)?.of?.[0]?.fields.find((f) => f.name === name);

describe('Experience and education schema', () => {
	it('is a document called cv', () => {
		expect(cv.type).toBe('document');
		expect(cv.name).toBe('cv');
	});

	it('has experience, qualifications and a CV file', () => {
		expect(fields.map((f) => f.name)).toEqual(['experience', 'qualifications', 'cvFile']);
	});

	it('limits how many entries there can be', () => {
		expect(rulesOf(field('experience'))).toContain('max(8)');
		expect(rulesOf(field('qualifications'))).toContain('max(6)');
	});

	it('requires the role, organisation and period of each experience entry', () => {
		for (const name of ['role', 'organisation', 'period']) {
			expect(rulesOf(entryField('experience', name))).toContain('required');
		}
	});

	it('requires the qualification, institution and period of each qualification', () => {
		for (const name of ['qualification', 'institution', 'period']) {
			expect(rulesOf(entryField('qualifications', name))).toContain('required');
		}
	});

	it('keeps descriptions short', () => {
		expect(rulesOf(entryField('experience', 'description'))).toContain('max(200)');
		expect(rulesOf(entryField('qualifications', 'detail'))).toContain('max(200)');
	});

	it('only accepts a PDF for the CV file', () => {
		expect(field('cvFile')?.type).toBe('file');
		expect(field('cvFile')?.options?.accept).toBe('application/pdf');
	});
});
