import { describe, expect, it } from 'vitest';
import { siteSettings } from './siteSettings';

const fields = (siteSettings as unknown as { fields: { name: string; validation?: unknown }[] })
	.fields;

/** Records which rules a field's validation asks for. */
const rulesOf = (name: string) => {
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
	const field = fields.find((f) => f.name === name);
	(field?.validation as ((r: unknown) => unknown) | undefined)?.(rule);
	return calls;
};

describe('Site settings schema', () => {
	it('is a document editors cannot duplicate', () => {
		expect(siteSettings.type).toBe('document');
		expect(siteSettings.name).toBe('siteSettings');
	});

	it('has a field for each piece of editable content', () => {
		expect(fields.map((f) => f.name)).toEqual([
			'name',
			'statement',
			'roleLine',
			'availabilityLine',
			'about',
			'email',
			'contactHeading',
			'siteTitle',
			'siteDescription',
		]);
	});

	it('requires the name, statement and email', () => {
		for (const name of ['name', 'statement', 'email']) {
			expect(rulesOf(name)).toContain('required');
		}
	});

	it('checks the email looks like an email address', () => {
		expect(rulesOf('email')).toContain('email');
	});

	it('limits the length of the long text fields', () => {
		expect(rulesOf('statement')).toContain('max(200)');
		expect(rulesOf('about')).toContain('max(600)');
		expect(rulesOf('siteDescription')).toContain('max(160)');
	});
});
