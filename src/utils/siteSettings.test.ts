import { describe, expect, it } from 'vitest';
import { SITE_SETTINGS_QUERY } from './sanity';
import { DEFAULT_SITE_SETTINGS, resolveSiteSettings } from './siteSettings';
import { full, minimal, rawCleared } from './siteSettings.fixture';

describe('Site settings query', () => {
	it('looks up the single site settings document', () => {
		expect(SITE_SETTINGS_QUERY).toContain('_type == "siteSettings"');
		expect(SITE_SETTINGS_QUERY).toContain('[0]');
	});

	it('fetches only the fields the site uses', () => {
		for (const field of [
			'name',
			'statement',
			'roleLine',
			'availabilityLine',
			'about',
			'email',
			'contactHeading',
			'siteTitle',
			'siteDescription',
		]) {
			expect(SITE_SETTINGS_QUERY).toContain(field);
		}
		expect(SITE_SETTINGS_QUERY).not.toContain('...');
	});
});

describe('Site settings with defaults', () => {
	describe('given no settings document', () => {
		it('uses the built-in defaults so the site still builds', () => {
			expect(resolveSiteSettings(null)).toEqual(DEFAULT_SITE_SETTINGS);
		});

		it('has no email, so no made-up address is shown', () => {
			expect(resolveSiteSettings(null).email).toBeUndefined();
		});
	});

	describe('given a document with every field filled in', () => {
		it('keeps what the editor wrote', () => {
			expect(resolveSiteSettings(full)).toEqual(full);
		});
	});

	describe('given a document where every field is cleared', () => {
		const settings = resolveSiteSettings(rawCleared);

		it('falls back to the defaults for the fields the page cannot do without', () => {
			expect(settings.name).toBe(DEFAULT_SITE_SETTINGS.name);
			expect(settings.statement).toBe(DEFAULT_SITE_SETTINGS.statement);
			expect(settings.contactHeading).toBe(DEFAULT_SITE_SETTINGS.contactHeading);
			expect(settings.siteTitle).toBe(DEFAULT_SITE_SETTINGS.siteTitle);
			expect(settings.siteDescription).toBe(DEFAULT_SITE_SETTINGS.siteDescription);
		});

		it('leaves the optional fields out', () => {
			expect(settings.roleLine).toBeUndefined();
			expect(settings.availabilityLine).toBeUndefined();
			expect(settings.about).toBeUndefined();
			expect(settings.email).toBeUndefined();
		});
	});

	describe('given a document with only the required fields', () => {
		it('keeps them and leaves the rest out', () => {
			const settings = resolveSiteSettings(minimal);
			expect(settings.name).toBe(minimal.name);
			expect(settings.about).toBeUndefined();
		});
	});
});
